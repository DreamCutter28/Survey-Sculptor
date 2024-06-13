const express = require('express'); // Фреймворк для серверной части веб-приложения, обрабатка HTTP-запросов, отправление ответов

const apiRoutes = require('./routes/api');

const cors = require('cors'); // Cross-Origin Resource Sharing
const path = require('path'); // Модуль для работы с путями файлов и директорий в Node.js

/*
позволяет веб-приложению делать запросы к серверу из других доменов, 
что необходимо для корректной работы клиентской части приложения 
(например, когда клиентская часть запущена на одном домене, а серверная часть - на другом).
*/

const app = express(); // Создаем экземпляр express


// ================== ДЛЯ РАЗРАБОТКИ =====================
const corsOptions = {
    origin: 'http://localhost:3000', // Разрешить домен клиента (на этапе разработки)
};
app.use(cors(corsOptions));

app.use(express.json());
// ================== ============ =====================


// Регистрируем маршруты API. Все конечные точки API будут доступны по адресу /api/*.
app.use('/api', apiRoutes);



// // ================== ДЛЯ ПРОДАКШНА =====================
// // Добавляем раздачу статических файлов из директории билда React
// app.use(express.static(path.join(__dirname, '../client/build')));

// // Обработка всех остальных запросов, которые не являются API
// // Это нужно для поддержки клиентской маршрутизации (например, React Router)
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
// });
// // ================== ============ =====================



// Вывод в консоль о каждом запросе
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});


const port = process.env.PORT; //берем port из окружения

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});