// ============================================
// 🔤 ОБНОВЛЕНИЕ ИМЕНИ В ШАПКЕ
// ============================================

function updateHeaderName() {
    const nameEl = document.getElementById('headerName');
    if (!nameEl) return;

    // Пытаемся загрузить имя из резюме
    const saved = localStorage.getItem('resumeData');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            // Если имя есть и оно не пустое и не "Введите имя"
            if (data.name && data.name.trim() !== '' && data.name !== 'Введите имя') {
                nameEl.textContent = data.name;
                return;
            }
        } catch (e) {
            console.warn('Ошибка загрузки имени из резюме:', e);
        }
    }

    // Если данных нет — показываем стандартное имя
    nameEl.textContent = 'Беккер Артём';
}

// Запускаем при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    updateHeaderName();
});

// Также обновляем при изменении данных в localStorage (для других вкладок)
window.addEventListener('storage', function (e) {
    if (e.key === 'resumeData') {
        updateHeaderName();
    }
});