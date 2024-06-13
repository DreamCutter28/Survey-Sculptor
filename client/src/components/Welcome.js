import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const Welcome = () => {
    return (
        <Box textAlign="center" mt={5}>
            <Typography variant="h4" gutterBottom>
                Добро пожаловать!
            </Typography>
            <Typography variant="body1" mb={3}>
                Чтобы приступить к работе, выберите или добавьте вопрос слева.
            </Typography>
        </Box>
    );
};

export default Welcome;
