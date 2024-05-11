import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

/**
 * Компонент для отображения страницы ошибки 404.
 */
const NotFound = () => {
    // Hook из react-router-dom для программного управления навигацией
    const navigate = useNavigate();

    return (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
            {/* Заголовок страницы */}
            <Typography variant="h4" gutterBottom>
                404 - Страница не найдена
            </Typography>
            {/* Подзаголовок с описанием ошибки */}
            <Typography variant="subtitle1">
                К сожалению, запрашиваемая страница не найдена.
            </Typography>
            {/* Кнопка для возврата на главную страницу */}
            <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => navigate('/')}>
                Вернуться на главную
            </Button>
        </Box>
    );
};

export default NotFound;
