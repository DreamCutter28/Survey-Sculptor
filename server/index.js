const express = require('express'); // Фреймворк для серверной части веб-приложения, обрабатка HTTP-запросов, отправление ответов

const apiRoutes = require('./routes/api');

const cors = require('cors'); // Cross-Origin Resource Sharing
/*
позволяет веб-приложению делать запросы к серверу из других доменов, 
что необходимо для корректной работы клиентской части приложения 
(например, когда клиентская часть запущена на одном домене, а серверная часть - на другом).
*/



const app = express(); // Создаем экземпляр express

app.use(cors());
app.use(express.json());

// Вывод в консоль о каждом запросе
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});


// Регистрируем маршруты API. Все конечные точки API будут доступны по адресу /api/*.
app.use('/api', apiRoutes);




const port = process.env.PORT || 5000; //берем port из окружения; если не определен - 5000.

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});