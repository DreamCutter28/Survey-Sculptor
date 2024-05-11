import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

/**
 * Отображает центрированный индикатор загрузки с текстом под ним.
 * Компонент может быть использован в любом месте приложения, где необходимо указать
 * пользователю, что идет процесс загрузки данных.
 * 
 * @param {Object} props - Свойства компонента.
 * @param {string} props.text - Текст, отображаемый под индикатором.
 * Если текст не передан, по умолчанию будет использоваться 'Загрузка...'.
 */
const LoadingIndicator = ({ text = 'Загрузка...' }) => {
    return (
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" p={3}>
            <CircularProgress />
            <Typography variant="h6" sx={{ mt: 2 }}>
                {text}
            </Typography>
        </Box>
    );
};

export default LoadingIndicator;
