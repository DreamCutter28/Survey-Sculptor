import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { INT_QUESTION_ID, QUESTION_ID } from '../constants';
import {
    fetchQuestionConditions,
    fetchQuestionOptions,
} from '../store/surveySlice';
import store from '../store/store';

import { saveAs } from 'file-saver';
const Save = () => {
    const { questions, selectedQuestion } = useSelector(
        (state) => state.survey
    );
    const dispatch = useDispatch();

    const [isBookmarkVisible, setIsBookmarkVisible] = useState(true);
    const [isSaveCurrentButtonVisible, setIsSaveCurrentButtonVisible] =
        useState(false);

    const isAnyQuestionModified = (questions) => {
        return questions.some((question) => question.isModified);
    };

    const currentQuestion = questions.find(
        (q) => q[INT_QUESTION_ID] === selectedQuestion?.[INT_QUESTION_ID]
    );

    useEffect(() => {
        if (currentQuestion && currentQuestion.isModified === true) {
            setIsSaveCurrentButtonVisible(true);
        } else {
            setIsSaveCurrentButtonVisible(false);
        }
    }, [currentQuestion]);

    const toggleBookmarkVisibility = () => {
        setIsBookmarkVisible(!isBookmarkVisible);
    };

    if (!isAnyQuestionModified(questions)) {
        return null;
    }

    const handleSaveQuestion = (question) => {
        try {
            console.log('Сохранение вопроса:', question);
            const jsonQuestion = JSON.stringify(question);
            // Создаем объект Blob из JSON-строки
            const blob = new Blob([jsonQuestion], { type: 'application/json' });
            saveAs(blob, 'question.json');
        } catch (error) {
            console.error('Ошибка при сохранении вопроса:', error);
        }
    };
    const handleSaveSurvey = async () => {
        console.log('Сохранение опроса:', questions);
        const fetchPromises = questions
            .map((q) => {
                const promises = [];
                if (!q?.options_of_question) {
                    promises.push(
                        dispatch(fetchQuestionOptions(q[QUESTION_ID]))
                    );
                }
                if (!q?.question_conditions) {
                    promises.push(
                        dispatch(fetchQuestionConditions(q[INT_QUESTION_ID]))
                    );
                }
                return promises;
            })
            .flat();

        try {
            await Promise.all(fetchPromises);
            const updatedQuestions = store.getState().survey.questions;
            const jsonQuestions = JSON.stringify(updatedQuestions);
            // Создаем объект Blob из JSON-строки
            const blob = new Blob([jsonQuestions], {
                type: 'application/json',
            });
            saveAs(blob, 'questions.json');
        } catch (error) {
            console.error('Ошибка при сохранении опроса:', error);
        }
    };

    return (
        <Box
            sx={{
                position: 'fixed',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: isBookmarkVisible ? '50%' : '50px',
                height: isBookmarkVisible ? '70px' : '30px',
                textAlign: 'center',
                backgroundColor: 'white',
                boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s ease-in-out',
                borderRadius: '10px 10px 0 0',
                zIndex: 15,
                border: '1px solid #ccc',
                borderBottom: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}
            onClick={!isBookmarkVisible ? toggleBookmarkVisibility : null}
        >
            {isBookmarkVisible ? (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    {/* Язычок для скрытия кнопки */}
                    <Box
                        onClick={toggleBookmarkVisibility}
                        sx={{
                            position: 'absolute',
                            top: '-20px',
                            width: '40px',
                            height: '20px',
                            backgroundColor: 'white',
                            borderRadius: '10px 10px 0 0',
                            cursor: 'pointer',
                            zIndex: 15,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            border: '1px solid #ccc',
                            boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <Box
                            sx={{
                                width: '20px',
                                height: '3px',
                                backgroundColor: 'black',
                                borderRadius: '3px',
                            }}
                        />
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            position: 'relative',
                            width: '100%',
                        }}
                    >
                        {isSaveCurrentButtonVisible && (
                            <Button
                                onClick={() => {
                                    handleSaveQuestion(currentQuestion);
                                }}
                                variant="outlined"
                                fullWidth
                                sx={{
                                    height: '100%',
                                    borderRadius: '10px 10px 0 0',
                                }}
                            >
                                Сохранить текущий вопрос
                            </Button>
                        )}
                        <Button
                            onClick={handleSaveSurvey}
                            variant="contained"
                            fullWidth
                            sx={{
                                height: '100%',
                                borderRadius: 'inherit',
                            }}
                        >
                            Сохранить опрос
                        </Button>
                    </Box>
                </Box>
            ) : (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        borderRadius: 'inherit',
                    }}
                >
                    <Box
                        sx={{
                            width: '20px',
                            height: '3px',
                            backgroundColor: 'black',
                            borderRadius: '3px',
                        }}
                    />
                </Box>
            )}
        </Box>
    );
};

export default Save;
