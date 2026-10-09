/* ============================================================
   HEADER.JS — общий скрипт для всех страниц
   - Редактируемое имя пользователя (клик → инлайн-инпут)
   - Сохранение в localStorage
   - Отрисовка иконок Lucide после изменений
   ============================================================ */

(function () {
    'use strict';

    const NAME_STORAGE_KEY = 'userName';
    const DEFAULT_NAME = 'Студент';

    // ============================================================
    // ИКОНКИ LUCIDE
    // ============================================================
    function refreshIcons() {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }

    // ============================================================
    // ИМЯ ПОЛЬЗОВАТЕЛЯ
    // ============================================================
    function getUserName() {
        try {
            return localStorage.getItem(NAME_STORAGE_KEY) || DEFAULT_NAME;
        } catch {
            return DEFAULT_NAME;
        }
    }

    function setUserName(name) {
        const clean = (name || '').trim();
        try {
            if (clean) {
                localStorage.setItem(NAME_STORAGE_KEY, clean);
            } else {
                localStorage.removeItem(NAME_STORAGE_KEY);
            }
        } catch (e) {
            console.warn('Не удалось сохранить имя:', e);
        }
        renderUserName();
    }

    function renderUserName() {
        const nameEl = document.getElementById('headerName');
        if (nameEl) {
            nameEl.textContent = getUserName();
        }
    }

    // ============================================================
    // РЕДАКТИРУЕМОЕ ИМЯ
    // ============================================================
    function initEditableName() {
        const nameEl = document.getElementById('headerName');
        if (!nameEl) return;

        // Сразу рендерим сохранённое имя
        renderUserName();

        // Помечаем как редактируемое
        nameEl.classList.add('header-name');
        if (!nameEl.hasAttribute('title')) {
            nameEl.setAttribute('title', 'Нажми, чтобы изменить имя');
        }

        // Создаём input динамически (если ещё нет)
        let inputEl = document.getElementById('headerNameInput');
        if (!inputEl) {
            inputEl = document.createElement('input');
            inputEl.type = 'text';
            inputEl.id = 'headerNameInput';
            inputEl.className = 'header-name-input';
            inputEl.maxLength = 40;
            inputEl.placeholder = 'Введи имя';
            inputEl.style.display = 'none';

            // Оборачиваем name и input в обёртку
            const wrap = document.createElement('div');
            wrap.className = 'header-name-wrap';
            nameEl.parentNode.insertBefore(wrap, nameEl);
            wrap.appendChild(nameEl);
            wrap.appendChild(inputEl);
        }

        // Клик по имени → редактирование
        nameEl.addEventListener('click', () => {
            inputEl.value = getUserName();
            nameEl.style.display = 'none';
            inputEl.style.display = 'inline-block';
            inputEl.focus();
            inputEl.select();
        });

        // Enter → сохранить, Escape → отмена
        inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                setUserName(inputEl.value);
                closeEditor();
            } else if (e.key === 'Escape') {
                closeEditor();
            }
        });

        // Blur → сохранить
        inputEl.addEventListener('blur', () => {
            setUserName(inputEl.value);
            closeEditor();
        });

        function closeEditor() {
            inputEl.style.display = 'none';
            nameEl.style.display = 'inline';
            renderUserName();
        }
    }

    // ============================================================
    // ЗАПУСК
    // ============================================================
    function init() {
        initEditableName();
        refreshIcons();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Экспорт для возможного переиспользования
    window.HeaderJS = {
        getUserName,
        setUserName,
        renderUserName,
        refreshIcons
    };
})();