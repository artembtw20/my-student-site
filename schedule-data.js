// ============================================
// 📅 РАСПИСАНИЕ — ДАННЫЕ И РЕДАКТИРОВАНИЕ
// ============================================

// ===== СТАНДАРТНОЕ РАСПИСАНИЕ =====
const DEFAULT_SCHEDULE = {
    week1: {
        monday: [
            { time: '08:15 – 09:45', name: '—', teacher: '' },
            { time: '09:55 – 11:25', name: '—', teacher: '' },
            { time: '11:35 – 13:05', name: '—', teacher: '' },
            { time: '14:00 – 15:30', name: '—', teacher: '' },
            { time: '15:40 – 17:10', name: '—', teacher: '' },
            { time: '17:20 – 18:50', name: '—', teacher: '' }
        ],
        tuesday: [
            { time: '08:15 – 09:45', name: 'Иностранный язык', teacher: 'ауд. 226, Мусаева Е.Г.' },
            { time: '09:55 – 11:25', name: 'Физика', teacher: 'ауд. 407, Голубева И.А.' },
            { time: '11:35 – 13:05', name: 'Физика', teacher: 'ауд. 407, Голубева И.А.' },
            { time: '14:00 – 15:30', name: '—', teacher: '' },
            { time: '15:40 – 17:10', name: '—', teacher: '' },
            { time: '17:20 – 18:50', name: '—', teacher: '' }
        ],
        wednesday: [
            { time: '08:15 – 09:45', name: 'Основы экономических знаний', teacher: 'ауд. 305, Плешивцев А.В.' },
            { time: '09:55 – 11:25', name: 'Конфликтология', teacher: 'ауд. 518, Слюсарева Е.А.' },
            { time: '11:35 – 13:05', name: 'Теория принятия решений', teacher: 'ауд. 331, Самохвалова С.Г.' },
            { time: '14:00 – 15:30', name: '—', teacher: '' },
            { time: '15:40 – 17:10', name: 'Основы экономических знаний', teacher: 'ауд. moodle, Плешивцев А.В.' },
            { time: '17:20 – 18:50', name: 'Общая физическая подготовка', teacher: 'ауд, Спортвный зал 1, Корчевский А.М.' }
        ],
        thursday: [
            { time: '08:15 – 09:45', name: 'Гуманитарные аспекты информационной безопасности', teacher: 'ауд. 303, Никитина И.В.' },
            { time: '09:55 – 11:25', name: '—', teacher: '' },
            { time: '11:35 – 13:05', name: 'Философия', teacher: 'ауд. 323, Хворостяной А.А.' },
            { time: '14:00 – 15:30', name: 'Конфликтология', teacher: 'ауд. 4. Слюсарева Е.А.' },
            { time: '15:40 – 17:10', name: '—', teacher: '' },
            { time: '17:20 – 18:50', name: '—', teacher: '' }
        ],
        friday: [
            { time: '08:15 – 09:45', name: 'Технологии и методы программирования', teacher: ' ауд. 323, Акилова И.М.' },
            { time: '09:55 – 11:25', name: 'Теория принятия решений', teacher: 'ауд. 331, Самохвалова С.Г.' },
            { time: '11:35 – 13:05', name: '—', teacher: '' },
            { time: '14:00 – 15:30', name: '—', teacher: '' },
            { time: '15:40 – 17:10', name: '—', teacher: '' },
            { time: '17:20 – 18:50', name: '—', teacher: '' }
        ],
        saturday: [
            { time: '08:15 – 09:45', name: 'Философия', teacher: 'ауд. moodle, Черепкова О.О.' },
            { time: '09:55 – 11:25', name: 'Python.Анализ данных', teacher: 'ауд. 434, Нацвин А.В.' },
            { time: '11:35 – 13:05', name: '—', teacher: '' },
            { time: '14:00 – 15:30', name: '—', teacher: '' },
            { time: '15:40 – 17:10', name: '—', teacher: '' },
            { time: '17:20 – 18:50', name: '—', teacher: '' }
        ],
        sunday: []
    },
    week2: {
        monday: [
            { time: '08:15 – 09:45', name: '—', teacher: '' },
            { time: '09:55 – 11:25', name: '—', teacher: '' },
            { time: '11:35 – 13:05', name: 'Технологии и методы программирования', teacher: 'ауд. 334, Самарин А.Д.' },
            { time: '14:00 – 15:30', name: 'Правовые основы антикоррупционного поведения', teacher: 'ауд. 1, Морозов Ю.Г.' },
            { time: '15:40 – 17:10', name: 'Гуманитарные аспекты информационной безопасности', teacher: 'ауд. 304, Никитина И.В.' },
            { time: '17:20 – 18:50', name: '—', teacher: '' }
        ],
        tuesday: [
            { time: '08:15 – 09:45', name: 'Иностранный язык', teacher: 'ауд.226, Мусаева Е.Г.' },
            { time: '09:55 – 11:25', name: 'Физика', teacher: 'ауд. 416, Голубева И.А.' },
            { time: '11:35 – 13:05', name: 'Физика', teacher: 'ауд. 407, Голубева И.А.' },
            { time: '14:00 – 15:30', name: 'Функциональный процесс и организация предприятия', teacher: 'ауд. 322, Мясоедов С.А.' },
            { time: '15:40 – 17:10', name: '—', teacher: '' },
            { time: '17:20 – 18:50', name: '—', teacher: '' }
        ],
        wednesday: [
            { time: '08:15 – 09:45', name: '—', teacher: '' },
            { time: '09:55 – 11:25', name: '—', teacher: '' },
            { time: '11:35 – 13:05', name: 'Теория принятия решений', teacher: 'ауд. 331, Самохвалова С.Г.' },
            { time: '14:00 – 15:30', name: '—', teacher: '' },
            { time: '15:40 – 17:10', name: 'Основы экономических знаний', teacher: 'ауд. moodle, Плешивцев А.В.' },
            { time: '17:20 – 18:50', name: 'Общая физическая подготовка', teacher: 'ауд. Спортивный зал 1, Корчевский А.М.' }
        ],
        thursday: [
            { time: '08:15 – 09:45', name: 'Функциональный процесс и организация предприятия', teacher: 'ауд. 305, Мясоедов С.А.' },
            { time: '09:55 – 11:25', name: '—', teacher: '' },
            { time: '11:35 – 13:05', name: 'Правовые основы антикоррупционного поведения', teacher: 'ауд. 303, Морозов Ю.Г.' },
            { time: '14:00 – 15:30', name: '—', teacher: '' },
            { time: '15:40 – 17:10', name: '—', teacher: '' },
            { time: '17:20 – 18:50', name: '—', teacher: '' }
        ],
        friday: [
            { time: '08:15 – 09:45', name: 'Технологии и методы программирования', teacher: ' ауд. 323, Акилова И.М.' },
            { time: '09:55 – 11:25', name: 'Теория принятия решений', teacher: 'ауд. 333, Самохвалова С.Г.' },
            { time: '11:35 – 13:05', name: '—', teacher: '' },
            { time: '14:00 – 15:30', name: '—', teacher: '' },
            { time: '15:40 – 17:10', name: '—', teacher: '' },
            { time: '17:20 – 18:50', name: '—', teacher: '' }
        ],
        saturday: [
            { time: '08:15 – 09:45', name: 'Философия', teacher: 'ауд. moodle, Черепкова О.О.' },
            { time: '09:55 – 11:25', name: 'Python.Анализ данных', teacher: 'ауд. 434, Нацвин А.В.' },
            { time: '11:35 – 13:05', name: '—', teacher: '' },
            { time: '14:00 – 15:30', name: '—', teacher: '' },
            { time: '15:40 – 17:10', name: '—', teacher: '' },
            { time: '17:20 – 18:50', name: '—', teacher: '' }
        ],
        sunday: []
    }
};

// ===== ПОЛУЧЕНИЕ ДАННЫХ =====
function getSchedule() {
    const saved = localStorage.getItem('scheduleData');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed.week1 && parsed.week2) {
                return parsed;
            }
        } catch { }
    }
    return JSON.parse(JSON.stringify(DEFAULT_SCHEDULE));
}

// ===== СОХРАНЕНИЕ ДАННЫХ =====
function saveSchedule(data) {
    localStorage.setItem('scheduleData', JSON.stringify(data));
}

// ===== СБРОС К СТАНДАРТУ =====
function resetSchedule() {
    const defaultData = JSON.parse(JSON.stringify(DEFAULT_SCHEDULE));
    saveSchedule(defaultData);
    return defaultData;
}

// ===== ПОЛУЧЕНИЕ ДНЯ НЕДЕЛИ =====
function getDayName(index) {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    return days[index] || 'monday';
}

// ===== ЭКСПОРТ =====
window.getSchedule = getSchedule;
window.saveSchedule = saveSchedule;
window.resetSchedule = resetSchedule;
window.getDayName = getDayName;
window.DEFAULT_SCHEDULE = DEFAULT_SCHEDULE;