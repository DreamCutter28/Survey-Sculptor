import React, { useEffect, useState } from 'react';
import { Drawer, Toolbar, Box, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import SurveyNavigator from './SurveyNavigator';
import SurveyQuestionEditor from './SurveyQuestionEditor';
import LoadingIndicator from './LoadingIndicator';
import { fetchSurvey, addQuestion } from '../store/surveySlice';
import { Add, Settings } from '@mui/icons-material';
import SettingsModal from './SettingsModal';
import Welcome from './Welcome';
import SettingsParameterWrapper from './SettingsParameterWrapper';
import Save from './Save';

const { INT_QUESTION_ID, QUESTION_ID, QUESTION_NAME } = require('../constants');

const SurveyEditor = () => {
    const { interview_id } = useParams();
    const location = useLocation();
    const dispatch = useDispatch();
    const { questions, status, interviewId, selectedQuestion } = useSelector(
        (state) => state.survey
    );
    const [isSurveySettingsOpen, setIsSurveySettingsOpen] = useState(false);

    const handleOpenSettingsModal = () => setIsSurveySettingsOpen(true);
    const handleCloseSettingsModal = () => setIsSurveySettingsOpen(false);

    const parameterDetailsComponent = <></>;

    const settingParameters = [
        <SettingsParameterWrapper
            parameterHeader={'Приоритет'}
            parametersDetailComponents={[parameterDetailsComponent]}
        />,
    ];

    useEffect(() => {
        if (location.state && location.state.pages) {
            // Обработка создания нового опроса
            location.state.pages.forEach((page) => {
                dispatch(addQuestion(page));
            });
        } else if (status === 'idle' || interviewId !== interview_id) {
            dispatch(fetchSurvey(interview_id));
        }
    }, [dispatch, interview_id, interviewId, status, location.state]);

    const handleAddQuestion = () => {
        const newIntQuestionId = 'tmp_' + uuidv4();
        const newQuestionId = 'tmp_' + uuidv4();
        const newQuestion = {
            [INT_QUESTION_ID]: newIntQuestionId,
            [QUESTION_ID]: newQuestionId,
            [QUESTION_NAME]: '',
        };
        dispatch(addQuestion(newQuestion));
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer
                variant="permanent"
                anchor="left"
                open
                sx={{
                    width: 240,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 240,
                        boxSizing: 'border-box',
                        overflowX: 'hidden',
                    },
                }}
            >
                <Toolbar />
                <SurveyNavigator />
                <Box
                    sx={{
                        mt: 'auto',
                        p: 2,
                        position: 'sticky',
                        bottom: 0,
                        backgroundColor: 'inherit',
                    }}
                >
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<Settings />}
                        onClick={handleOpenSettingsModal}
                        fullWidth
                        sx={{
                            whiteSpace: 'nowrap',
                            p: 1,
                        }}
                    >
                        Настройка опроса
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={handleAddQuestion}
                        fullWidth
                        sx={{
                            whiteSpace: 'nowrap',
                            p: 1,
                        }}
                    >
                        Добавить вопрос
                    </Button>
                </Box>
            </Drawer>

            <Box sx={{ flex: 1, p: 3 }}>
                {status === 'loading' ? (
                    <LoadingIndicator text="Загрузка вопросов..." />
                ) : (
                    <>
                        {selectedQuestion ? (
                            <>
                                {Array.isArray(questions) &&
                                    (() => {
                                        const question = questions.find(
                                            (q) =>
                                                q[INT_QUESTION_ID] ===
                                                selectedQuestion.question_of_interview_id
                                        );
                                        return (
                                            <SurveyQuestionEditor
                                                question={question}
                                            />
                                        );
                                    })()}
                            </>
                        ) : (
                            <Welcome />
                        )}
                    </>
                )}
            </Box>
            <SettingsModal
                settingsParameters={settingParameters}
                open={isSurveySettingsOpen}
                onClose={handleCloseSettingsModal}
                title={`Настройка опроса`}
            />
            <Save />
        </Box>
    );
};

export default SurveyEditor;
