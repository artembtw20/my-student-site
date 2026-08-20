// ============================================
// 📦 РАБОТА С INDEXEDDB
// ============================================

const DB_NAME = 'StudentNotesDB';
const DB_VERSION = 1;
const STORE_NAME = 'notes';

// ===== ОТКРЫТИЕ БАЗЫ ДАННЫХ =====
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = function(event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, {
                    keyPath: 'id',
                    autoIncrement: true
                });
                store.createIndex('subject', 'subject', { unique: false });
                store.createIndex('date', 'date', { unique: false });
                console.log('📦 База данных создана');
            }
        };

        request.onsuccess = function(event) {
            resolve(event.target.result);
        };

        request.onerror = function(event) {
            reject(event.target.error);
        };
    });
}

// ===== ПОЛУЧЕНИЕ ВСЕХ ЗАПИСЕЙ ПО ПРЕДМЕТУ =====
async function getNotesBySubject(subject) {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const index = store.index('subject');
            const request = index.getAll(subject);

            request.onsuccess = function() {
                resolve(request.result);
            };
            request.onerror = function() {
                reject(request.error);
            };
        });
    } catch (error) {
        console.error('Ошибка получения записей:', error);
        return [];
    }
}

// ===== ДОБАВЛЕНИЕ НОВОЙ ЗАПИСИ =====
async function addNote(subject, data, date, name) {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.add({ subject, data, date, name });

            request.onsuccess = function() {
                resolve(request.result);
            };
            request.onerror = function() {
                reject(request.error);
            };
        });
    } catch (error) {
        console.error('Ошибка добавления записи:', error);
        throw error;
    }
}

// ===== УДАЛЕНИЕ ЗАПИСИ =====
async function deleteNoteById(id) {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.delete(id);

            request.onsuccess = function() {
                resolve();
            };
            request.onerror = function() {
                reject(request.error);
            };
        });
    } catch (error) {
        console.error('Ошибка удаления записи:', error);
        throw error;
    }
}

// ===== ОЧИСТКА ВСЕХ ЗАПИСЕЙ =====
async function clearAllNotes() {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.clear();

            request.onsuccess = function() {
                resolve();
            };
            request.onerror = function() {
                reject(request.error);
            };
        });
    } catch (error) {
        console.error('Ошибка очистки:', error);
        throw error;
    }
}

// ===== ПОЛУЧЕНИЕ КОЛИЧЕСТВА ЗАПИСЕЙ =====
async function getNotesCount(subject) {
    try {
        const notes = await getNotesBySubject(subject);
        return notes.length;
    } catch (error) {
        console.error('Ошибка подсчёта:', error);
        return 0;
    }
}

// ===== ЭКСПОРТ ДАННЫХ ДЛЯ БЭКАПА =====
async function exportAllNotes() {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.getAll();

            request.onsuccess = function() {
                resolve(request.result);
            };
            request.onerror = function() {
                reject(request.error);
            };
        });
    } catch (error) {
        console.error('Ошибка экспорта:', error);
        return [];
    }
}

// ===== ИМПОРТ ДАННЫХ ИЗ БЭКАПА =====
async function importAllNotes(data) {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);

            // Сначала очищаем
            const clearRequest = store.clear();
            clearRequest.onsuccess = function() {
                // Затем добавляем все записи
                let count = 0;
                data.forEach(item => {
                    // Удаляем id, чтобы он создался автоматически
                    const { id, ...rest } = item;
                    const addRequest = store.add(rest);
                    addRequest.onsuccess = function() {
                        count++;
                        if (count === data.length) {
                            resolve();
                        }
                    };
                    addRequest.onerror = function() {
                        reject(addRequest.error);
                    };
                });
                if (data.length === 0) {
                    resolve();
                }
            };
            clearRequest.onerror = function() {
                reject(clearRequest.error);
            };
        });
    } catch (error) {
        console.error('Ошибка импорта:', error);
        throw error;
    }
}