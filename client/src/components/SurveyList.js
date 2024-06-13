//components/SurveyList.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Paper, IconButton, Button } from '@mui/material';
import { Edit, Add } from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import LoadingIndicator from './LoadingIndicator';
/**
 * Отображает список опросов с возможностью их редактирования.
 * Использует перетаскивание для изменения порядка опросов в списке.
 */
const SurveyList = () => {
    const [surveys, setSurveys] = useState([]); // Хранение списка опросов
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        fetch(`${process.env.REACT_APP_API_URL}/surveys`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setSurveys(data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Ошибка загрузки опросов:', error);
                setIsLoading(false);
            });
    }, []);

    const onDragEnd = (result) => {
        const { source, destination } = result;

        if (!destination) return;

        const reorderedSurveys = Array.from(surveys); // Копия массива опросов
        const [moved] = reorderedSurveys.splice(source.index, 1); // Извлечение перетаскиваемого элемента
        reorderedSurveys.splice(destination.index, 0, moved); // Вставка элемента на новую позицию

        setSurveys(reorderedSurveys); // Обновление состояния с новым порядком опросов
    };

    if (isLoading) {
        return <LoadingIndicator text="Загрузка опросов..." />;
    }

    // Рендеринг списка опросов
    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Список опросов
            </Typography>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="survey-list">
                    {(provided) => (
                        <Box
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {surveys.length > 0 ? (
                                surveys.map((survey, index) => (
                                    <Draggable
                                        key={survey.id}
                                        draggableId={`survey-${survey.id}`}
                                        index={index}
                                    >
                                        {(provided) => (
                                            <Paper
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    mb: 2,
                                                    p: 2,
                                                }}
                                            >
                                                <Box sx={{ flexGrow: 1 }}>
                                                    <Typography variant="h6">
                                                        {survey.name}
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        {survey.description}
                                                    </Typography>
                                                </Box>
                                                <IconButton
                                                    component={Link}
                                                    to={`/survey/edit/${survey.id}`}
                                                    size="medium"
                                                    sx={{ ml: 2 }}
                                                >
                                                    <Edit fontSize="medium" />
                                                </IconButton>
                                            </Paper>
                                        )}
                                    </Draggable>
                                ))
                            ) : (
                                <Typography>Опросов не найдено</Typography>
                            )}
                            {provided.placeholder}
                            <Button
                                component={Link}
                                to="/survey/create"
                                variant="outlined"
                                color="primary"
                                startIcon={<Add />}
                                fullWidth
                                sx={{ mt: 2, p: 2 }}
                            >
                                Создать опрос
                            </Button>
                        </Box>
                    )}
                </Droppable>
            </DragDropContext>
        </Box>
    );
};

export default SurveyList;
