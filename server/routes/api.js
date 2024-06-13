const express = require('express');
const router = express.Router();
const db = require('../config/database');

const {
    INT_QUESTION_ID,
    QUESTION_ID,
    QUESTION_NAME,
} = require('../../client/src/constants');

// GET-маршрут для получения списка всех опросов
router.get('/surveys', async (req, res) => {
    try {
        // Запрос к базе данных для получения списка опросов
        const interviewQuery =
            'SELECT id, name, description FROM tutorage.interview';
        const result = await db.query(interviewQuery);
        res.status(200).json(result.rows); // Отправка списка опросов клиенту
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
            res.json({
                message: 'Подключение к базе данных успешно',
                time: result.rows[0].now,
            });
        }
    });
});

router.get('/getInterviewQuestionList', async (req, res) => {
    const { interviewId } = req.query; // Получаем interviewId из параметров запроса
    try {
        const query = `
    SELECT qi.id AS "${INT_QUESTION_ID}", q.id AS "${QUESTION_ID}", q.name AS "${QUESTION_NAME}"
    FROM tutorage.question q
    JOIN tutorage.question_of_interview qi ON qi.question_id = q.id
    WHERE qi.interview_id = $1
    ORDER BY qi.priority ASC;
`;
        const result = await db.query(query, [interviewId]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Ошибка при получении списка вопросов:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/getQuestionOptions', async (req, res) => {
    const { question_id } = req.query;
    params = [question_id];
    try {
        const query = `
      SELECT
          o.id as option_id,
          o."text" as option_text,
          o."type"::text as option_type
      FROM
          tutorage."options" o
          JOIN tutorage.options_of_question oq ON oq.option_id = o.id
      WHERE
          oq.question_id = $1;
    `;
        const result = await db.query(query, params);
        res.status(200).json(result.rows || []);
    } catch (error) {
        console.error('Ошибка при получении опций вопроса:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/getQuestionList', async (req, res) => {
    try {
        const query = `
    SELECT q.id AS "question_id", q.name as "question_name"
    FROM tutorage.question q
    ORDER BY q.name ASC; 
    `;
        const result = await db.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Ошибка при получении списка всех вопросов:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Маршрут для получения списка опций для конкретного вопроса
router.get('/getOptionListByQuestion', async (req, res) => {
    const { questionId, optionType } = req.query;

    try {
        const query = `
        SELECT o.id AS "option_id", o.text AS "option_text", o.type::text AS "option_type"
        FROM tutorage.options_of_question qo
        JOIN tutorage.options o ON qo.option_id = o.id
        WHERE qo.question_id = $1 AND o.type = $2
        ORDER BY o.text ASC;
      `;

        const result = await db.query(query, [questionId, optionType]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Ошибка при получении списка опций для вопроса:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Маршрут для получения списка опций по типу
router.get('/getOptionListByType', async (req, res) => {
    const { optionType } = req.query;

    try {
        const query = `
      SELECT o.id AS "option_id", o.text AS "option_text", o.type::text AS "option_type"
      FROM tutorage.options o
      WHERE o.type = $1
      ORDER BY o.text ASC;
    `;

        const result = await db.query(query, [optionType]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Ошибка при получении списка опций по типу:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Маршрут для получения списка опций по типу
router.get('/getQuestionConditions', async (req, res) => {
    const { question_of_interview_id } = req.query;

    try {
        const query = `
SELECT 
    operand.id AS operand_id,
    operand.question_id AS operand_question_id,
    operand.compare_type_id AS operand_compare_type,
    json_agg(json_build_object('option_id', o.id::text, 'option_text', o.text, 'option_type', o.type::text)) AS q_options
FROM 
    tutorage.condition_operand operand
JOIN 
    tutorage.conditions c ON c.id = operand.condition_id
JOIN 
    tutorage.question_of_interview qi ON c.question_id = qi.id
LEFT JOIN 
    tutorage.key_value_question_option_condition kvo ON kvo.condition_operand_id = operand.id
LEFT JOIN 
    tutorage.options_of_question ofq ON ofq.id = kvo.option_of_question_id
LEFT JOIN 
    tutorage.options o ON o.id = ofq.option_id
WHERE 
    qi.id = $1
GROUP BY 
    operand.id, operand.question_id, operand.compare_type_id

  `;

        const result = await db.query(query, [question_of_interview_id]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Ошибка при получении логики вопроса:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/getCompareTypes', async (req, res) => {
    try {
        const query = `
  SELECT ct.id AS "compare_type_id", ct.name AS "compare_type_name"
    FROM tutorage.compare_type ct
  `;

        const result = await db.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Ошибка при получении типов сравнения:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
