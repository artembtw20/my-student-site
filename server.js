const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/api/check/:email', async (req, res) => {
    const email = req.params.email;

    if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Неверный формат email' });
    }

    try {
        console.log(`🔍 Проверка email: ${email}`);

        const response = await fetch(`https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}`, {
            headers: {
                'Accept': 'application/json',
                'hibp-api-key': '00000000000000000000000000000000'
            }
        });

        if (response.status === 200) {
            const data = await response.json();
            console.log(`✅ Найдено утечек: ${data.length}`);
            res.json({ breaches: data, count: data.length });
        } else if (response.status === 404) {
            console.log(`✅ Безопасно, утечек нет`);
            res.json({ breaches: [], count: 0 });
        } else {
            console.log(`⚠️ Ошибка HIBP: ${response.status}`);
            res.status(response.status).json({ error: `Ошибка HIBP: ${response.status}` });
        }
    } catch (error) {
        console.error('❌ Ошибка сервера:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
    console.log(`📡 Проверка утечек: http://localhost:${PORT}/api/check/test@hibp-integration-tests.com`);
});