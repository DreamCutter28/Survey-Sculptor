// Подключаем модуль dotenv для работы с переменными окружения из файла .env
require('dotenv').config();

const { Pool } = require('pg');

// Создаём экземпляр Pool, инициализируя его с помощью параметров из переменных окружения
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Экспортируем функцию query, которая может быть использована в других файлах для выполнения SQL-запросов
module.exports = {
    query: (text, params, callback) => {
        // Возвращаем результат выполнения метода query из библиотеки pg, передавая ему SQL-запрос, параметры и callback
        return pool.query(text, params, callback);
    },
};
