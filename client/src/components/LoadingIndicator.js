import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';


const LoadingIndicator = ({ text = 'Загрузка...' }) => {
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            p={3}
        >
            <CircularProgress />
            <Typography variant="h6" sx={{ mt: 2 }}>
                {text}
            </Typography>
        </Box>
    );
};

export default LoadingIndicator;
