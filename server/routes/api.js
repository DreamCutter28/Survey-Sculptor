const express = require('express');
const router = express.Router();
const db = require('../config/database');

// POST-маршрут для создания нового опроса
router.post('/surveys', async (req, res) => {
  const { name, description, pages } = req.body;  // Извлечение данных опроса из тела запроса

  try {
    // Вставка нового опроса в таблицу `interview` и получение его ID
    const interviewQuery = 'INSERT INTO tutorage.interview (name, desciption) VALUES ($1, $2) RETURNING id';
    const interviewValues = [name, description];
    const interviewResult = await db.query(interviewQuery, interviewValues);
    const interviewId = interviewResult.rows[0].id;  // ID созданного опроса

    // Перебор и сохранение каждой страницы опроса
    for (const page of pages) {
      const { question, type, options } = page;  // Извлечение деталей страницы

      // Вставка страницы опроса в таблицу `question`
      const questionQuery = 'INSERT INTO tutorage.question (name, desciption) VALUES ($1, $2) RETURNING id';
      const questionValues = [question, ''];
      const questionResult = await db.query(questionQuery, questionValues);
      const questionId = questionResult.rows[0].id;  // ID созданной страницы

      // Связывание страницы с опросом
      const questionOfInterviewQuery = 'INSERT INTO tutorage.question_of_interview (interview_id, question_id, priority, transition_type) VALUES ($1, $2, $3, $4)';
      const questionOfInterviewValues = [interviewId, questionId, 0, 0];
      await db.query(questionOfInterviewQuery, questionOfInterviewValues);

      // Сохранение вариантов ответа для страницы
      for (const option of options) {
        const optionQuery = 'INSERT INTO tutorage.options (text, type) VALUES ($1, $2) RETURNING id';
        const optionValues = [option, 0];  // Предполагается, что type это тип ответа (например, выбор)
        const optionResult = await db.query(optionQuery, optionValues);
        const optionId = optionResult.rows[0].id;  // ID варианта ответа

        // Связывание варианта ответа со страницей
        const optionOfQuestionQuery = 'INSERT INTO tutorage.options_of_question (option_id, question_id) VALUES ($1, $2)';
        const optionOfQuestionValues = [optionId, questionId];
        await db.query(optionOfQuestionQuery, optionOfQuestionValues);
      }
    }

    res.status(201).json({ message: 'Опрос успешно сохранен' });
  } catch (error) {
    console.error('Ошибка сохранения опроса:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// GET-маршрут для получения списка всех опросов
router.get('/surveys', async (req, res) => {
  try {
    // Запрос к базе данных для получения списка опросов
    const interviewQuery = 'SELECT id, name, description FROM tutorage.interview';
    const result = await db.query(interviewQuery);
    res.status(200).json(result.rows);  // Отправка списка опросов клиенту
  } catch (error) {
    console.error('Ошибка получения опросов:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});


// Тестовый GET-маршрут для проверки подключения к базе данных
router.get('/test', (req, res) => {
  db.query('SELECT NOW()', (err, result) => {
    if (err) {
      console.error('Ошибка выполнения запроса', err);
      res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    } else {
      res.json({ message: 'Подключение к базе данных успешно', time: result.rows[0].now });
    }
  });
});

module.exports = router;