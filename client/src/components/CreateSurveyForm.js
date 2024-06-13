import React, { useState } from 'react';
import { Button, TextField, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetSurveyState } from '../store/surveySlice';

const SurveyForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState({ name: false, description: false });
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleCreate = () => {
        let hasError = false;
        if (!name.trim()) {
            setErrors((prev) => ({ ...prev, name: 'Имя опроса обязательно' }));
            hasError = true;
        } else {
            setErrors((prev) => ({ ...prev, name: false }));
        }

        if (!description.trim()) {
            setErrors((prev) => ({
                ...prev,
                description: 'Описание обязательно',
            }));
            hasError = true;
        } else {
            setErrors((prev) => ({ ...prev, description: false }));
        }

        if (!hasError) {
            dispatch(resetSurveyState()); // Сбрасываем состояние перед навигацией
            navigate('/survey/edit/new', {
                state: { name, description, pages: [] },
            });
        }
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            mx="auto"
            width="70%"
            p={3}
        >
            <Typography variant="h5" gutterBottom>
                Создать новый опрос
            </Typography>
            <TextField
                label="Имя опроса"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                margin="dense"
                error={Boolean(errors.name)}
                helperText={errors.name}
            />
            <TextField
                label="Описание опроса"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                margin="dense"
                multiline
                error={Boolean(errors.description)}
                helperText={errors.description}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleCreate}
                sx={{ mt: 2 }}
            >
                Создать
            </Button>
        </Box>
    );
};

export default SurveyForm;
