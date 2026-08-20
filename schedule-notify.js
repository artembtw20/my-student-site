// ============================================
// 🔔 УВЕДОМЛЕНИЕ О ЗАВТРАШНИХ ПАРАХ
// ============================================

const NOTIFY_KEY = 'scheduleNotifyEnabled';

// ===== ПРОВЕРКА ПОДДЕРЖКИ УВЕДОМЛЕНИЙ =====
function isNotificationSupported() {
    return 'Notification' in window;
}

// ===== ЗАПРОС РАЗРЕШЕНИЯ =====
async function requestNotificationPermission() {
    if (!isNotificationSupported()) {
        console.warn('⚠️ Уведомления не поддерживаются в этом браузере');
        return false;
    }

    if (Notification.permission === 'granted') {
        return true;
    }

    if (Notification.permission === 'denied') {
        console.warn('⚠️ Уведомления заблокированы пользователем');
        return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
}

// ===== ПОЛУЧЕНИЕ ЗАВТРАШНИХ ПАР =====
function getTomorrowLessons() {
    const scheduleData = getSchedule();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayIndex = tomorrow.getDay();

    const dayMap = {
        0: 'sunday',
        1: 'monday',
        2: 'tuesday',
        3: 'wednesday',
        4: 'thursday',
        5: 'friday',
        6: 'saturday'
    };

    const dayKey = dayMap[dayIndex];
    if (!dayKey || dayKey === 'sunday') {
        return { dayName: 'Воскресенье', lessons: [], week: 0 };
    }

    const weekNum = getCurrentWeekNumber();
    const weekKey = weekNum === 1 ? 'week1' : 'week2';

    const dayLessons = scheduleData[weekKey]?.[dayKey] || [];

    const validLessons = dayLessons.filter(l =>
        l.name && l.name !== '—' && l.name !== '-' && l.name !== ''
    );

    const dayNames = {
        monday: 'Понедельник',
        tuesday: 'Вторник',
        wednesday: 'Среда',
        thursday: 'Четверг',
        friday: 'Пятница',
        saturday: 'Суббота',
        sunday: 'Воскресенье'
    };

    return {
        dayName: dayNames[dayKey] || 'Неизвестно',
        lessons: validLessons,
        week: weekNum
    };
}

// ===== ОПРЕДЕЛЕНИЕ НЕДЕЛИ =====
function getCurrentWeekNumber() {
    const now = new Date();
    const start = new Date(2026, 1, 1);
    const diff = Math.floor((now - start) / (7 * 24 * 60 * 60 * 1000));
    return (diff % 2 === 0) ? 1 : 2;
}

// ===== ПОКАЗ УВЕДОМЛЕНИЯ =====
function showTomorrowNotification() {
    const data = getTomorrowLessons();

    if (data.lessons.length === 0) {
        if (Notification.permission === 'granted') {
            new Notification('📅 Завтрашние пары', {
                body: `🎉 Завтра (${data.dayName}) пар нет! Можешь отдохнуть.`,
                icon: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f389.png'
            });
        }
        return;
    }

    let message = `📚 Завтра (${data.dayName}, ${data.week}-я неделя):\n\n`;
    data.lessons.forEach(l => {
        message += `  ${l.time} — ${l.name}`;
        if (l.teacher) message += ` (${l.teacher})`;
        message += '\n';
    });

    if (Notification.permission === 'granted') {
        const notification = new Notification('📅 Завтрашние пары', {
            body: message,
            icon: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f4da.png'
        });

        notification.onclick = function () {
            window.focus();
            window.location.href = 'schedule.html';
        };
    }
}

// ===== ПРОВЕРКА ВРЕМЕНИ =====
let lastNotificationDate = '';

function checkAndNotify() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    const enabled = localStorage.getItem(NOTIFY_KEY) !== 'false';

    if (!enabled) {
        return;
    }

    if (hours === 20 && minutes === 0) {
        const today = now.toDateString();
        if (lastNotificationDate !== today) {
            lastNotificationDate = today;
            console.log('🔔 Отправка уведомления о завтрашних парах...');

            if (Notification.permission === 'granted') {
                showTomorrowNotification();
            } else if (Notification.permission === 'default') {
                requestNotificationPermission().then(granted => {
                    if (granted) {
                        showTomorrowNotification();
                    }
                });
            }
        }
    }
}

// ===== ВКЛЮЧЕНИЕ/ОТКЛЮЧЕНИЕ =====
function toggleScheduleNotifications(enable) {
    localStorage.setItem(NOTIFY_KEY, String(enable));
    console.log(`🔔 Уведомления ${enable ? 'включены' : 'отключены'}`);
}

function isScheduleNotificationsEnabled() {
    return localStorage.getItem(NOTIFY_KEY) !== 'false';
}

// ===== ЗАПУСК =====
function startNotificationScheduler() {
    requestNotificationPermission();
    setInterval(checkAndNotify, 10000);
    setTimeout(checkAndNotify, 2000);
    console.log('🔔 Планировщик уведомлений запущен');
}

// ===== ЭКСПОРТ =====
window.showTomorrowNotification = showTomorrowNotification;
window.toggleScheduleNotifications = toggleScheduleNotifications;
window.isScheduleNotificationsEnabled = isScheduleNotificationsEnabled;
window.startNotificationScheduler = startNotificationScheduler;
window.requestNotificationPermission = requestNotificationPermission;