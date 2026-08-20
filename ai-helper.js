// ============================================
// 🤖 ИИ-ПОМОЩНИК (DeepSeek API)
// ============================================

// ⚠️ ВСТАВЬ СВОЙ API-КЛЮЧ СЮДА
const DEEPSEEK_API_KEY = 'Ваш ключ'; // ← Замени на свой ключ
const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions';

// ===== ОБЩАЯ ФУНКЦИЯ ДЛЯ ЗАПРОСА =====
async function askDeepSeek(messages) {
    try {
        const response = await fetch(DEEPSEEK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: messages,
                temperature: 0.7,
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Ошибка API');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Ошибка DeepSeek:', error);
        return `❌ Ошибка: ${error.message}`;
    }
}

// ============================================
// 1. 📊 АНАЛИЗ ПОСЕЩАЕМОСТИ + ИИ-СОВЕТ
// ============================================

async function getAttendanceAdvice() {
    // Получаем данные посещаемости
    const attendance = JSON.parse(localStorage.getItem('attendance')) || { attended: 0, total: 0 };
    const lessons = JSON.parse(localStorage.getItem('lessons')) || [];

    // Собираем статистику по предметам
    const subjects = {};
    lessons.forEach(lesson => {
        if (!subjects[lesson.name]) {
            subjects[lesson.name] = { total: 0, present: 0 };
        }
        subjects[lesson.name].total++;
        if (lesson.status === 'present') {
            subjects[lesson.name].present++;
        }
    });

    // Формируем запрос
    const prompt = `
        Ты — ИИ-помощник студента. Проанализируй данные о посещаемости и дай персонализированный совет.

        📊 Статистика посещаемости:
        - Всего пар: ${attendance.total}
        - Посещено: ${attendance.attended}
        - Пропущено: ${attendance.total - attendance.attended}
        - Процент посещаемости: ${attendance.total === 0 ? 0 : Math.round((attendance.attended / attendance.total) * 100)}%

        📋 По предметам:
        ${Object.entries(subjects).map(([name, data]) =>
        `- ${name}: ${data.present}/${data.total} (${data.total === 0 ? 0 : Math.round((data.present / data.total) * 100)}%)`
    ).join('\n')}

        На основе этих данных:
        1. Оцени текущую ситуацию с посещаемостью.
        2. Если есть проблемные предметы (низкий процент) — предложи конкретные шаги, как исправить.
        3. Дай 1-2 общих совета, как улучшить посещаемость.
        4. Будь конкретным, дружелюбным и мотивирующим.
        Ответ должен быть на русском языке, структурированным (используй эмодзи).
    `;

    const result = await askDeepSeek([
        { role: 'system', content: 'Ты — мотивирующий ИИ-коуч по учёбе. Отвечай кратко, конкретно и с эмодзи.' },
        { role: 'user', content: prompt }
    ]);

    return result;
}

// ============================================
// 2. 📅 УМНОЕ ПЛАНИРОВАНИЕ ДЕДЛАЙНОВ
// ============================================

async function getDeadlinePlan() {
    // Получаем дедлайны
    const deadlines = JSON.parse(localStorage.getItem('deadlines')) || [];

    if (deadlines.length === 0) {
        return '📭 У тебя пока нет дедлайнов. Добавь их на странице дедлайнов!';
    }

    // Сортируем по дате
    const sorted = [...deadlines].sort((a, b) => new Date(a.date) - new Date(b.date));

    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // Формируем запрос
    const prompt = `
        Ты — ИИ-планировщик студента. Составь оптимальный план на неделю на основе дедлайнов.

        📋 Список дедлайнов (сегодня ${today}):
        ${sorted.map(d => {
        const daysLeft = Math.ceil((new Date(d.date) - now) / (1000 * 60 * 60 * 24));
        return `- ${d.subject}: ${d.task} (срок: ${d.date}, осталось ${daysLeft} дней, приоритет: ${d.priority === 'high' ? 'ВЫСОКИЙ' : d.priority === 'medium' ? 'СРЕДНИЙ' : 'НИЗКИЙ'})`;
    }).join('\n')}

        На основе этих данных:
        1. Оцени, какие дедлайны самые срочные (меньше всего дней осталось).
        2. Составь пошаговый план на неделю (распиши по дням).
        3. Если есть дедлайны с высоким приоритетом — выдели их как самые важные.
        4. Дай 1-2 совета по управлению временем.
        Ответ должен быть на русском языке, структурированным по дням недели, с эмодзи.
    `;

    const result = await askDeepSeek([
        { role: 'system', content: 'Ты — ИИ-планировщик. Составляй чёткие планы по дням, используй эмодзи для наглядности.' },
        { role: 'user', content: prompt }
    ]);

    return result;
}

// ============================================
// 4. 🎯 ПЕРСОНАЛЬНЫЙ ИИ-КОУЧ (еженедельный отчёт)
// ============================================

async function getWeeklyReport() {
    // Получаем все данные
    const attendance = JSON.parse(localStorage.getItem('attendance')) || { attended: 0, total: 0 };
    const lessons = JSON.parse(localStorage.getItem('lessons')) || [];
    const deadlines = JSON.parse(localStorage.getItem('deadlines')) || [];
    const weekNumber = getCurrentWeekNumber();

    // Считаем выполненные дедлайны (за последнюю неделю)
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const completedDeadlines = deadlines.filter(d => {
        const dDate = new Date(d.date);
        return dDate < now && dDate > weekAgo;
    });

    const upcomingDeadlines = deadlines.filter(d => {
        const dDate = new Date(d.date);
        return dDate >= now;
    });

    // Формируем запрос
    const prompt = `
        Ты — персональный ИИ-коуч студента. Составь еженедельный отчёт.

        📊 Данные за последнюю неделю (неделя ${weekNumber}):
        
        📈 Посещаемость:
        - Всего пар: ${attendance.total}
        - Посещено: ${attendance.attended}
        - Процент: ${attendance.total === 0 ? 0 : Math.round((attendance.attended / attendance.total) * 100)}%

        📋 Дедлайны:
        - Выполнено за неделю: ${completedDeadlines.length}
        - Осталось выполнить: ${upcomingDeadlines.length}

        📅 Ближайшие дедлайны:
        ${upcomingDeadlines.sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 5).map(d =>
        `- ${d.subject}: ${d.task} (срок: ${d.date})`
    ).join('\n') || '— нет ближайших дедлайнов'}

        На основе этих данных составь:
        1. 📊 Краткую статистику недели (посещаемость, дедлайны).
        2. 📈 Оценку прогресса (что хорошо, что нужно улучшить).
        3. 🎯 Рекомендации на следующую неделю (2-3 конкретных совета).
        4. 💪 Мотивационное сообщение.
        Ответ должен быть структурированным, на русском языке, с эмодзи.
    `;

    const result = await askDeepSeek([
        { role: 'system', content: 'Ты — поддерживающий ИИ-коуч. Будь доброжелательным, конкретным и мотивирующим.' },
        { role: 'user', content: prompt }
    ]);

    return result;
}

// ============================================
// ⚙️ ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================

function getCurrentWeekNumber() {
    const now = new Date();
    const startDate = new Date(2026, 1, 1);
    const diff = Math.floor((now - startDate) / (7 * 24 * 60 * 60 * 1000));
    return Math.max(0, diff + 1);
}

// ============================================
// 📦 ЭКСПОРТ ФУНКЦИЙ (для использования в HTML)
// ============================================

// В HTML вызываем через onclick="getAttendanceAdvice()" и т.д.