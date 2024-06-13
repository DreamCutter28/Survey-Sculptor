import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Box, Button } from '@mui/material';
import CreatableSelect from 'react-select/creatable';
import { INT_QUESTION_ID, QUESTION_ID, QUESTION_NAME } from '../constants';
import LoadingIndicator from './LoadingIndicator';
import QuestionOptionsEditor from './QuestionOptionsEditor';
import QuestionConditionLogic from './QuestionConditionLogic';
import SettingsModal from './SettingsModal';
import {
    updateQuestion,
    fetchQuestionOptions,
    fetchQuestionConditions,
    selectQuestion,
} from '../store/surveySlice';
import axios from 'axios';

const SurveyQuestionEditor = ({ question }) => {
    const { questions } = useSelector((state) => state.survey);

    const dispatch = useDispatch();

    const [questionList, setQuestionList] = useState([]);
    const [isQuestionSettingsOpen, setIsQuestionSettingsOpen] = useState(false);

    const handleOpenSettingsModal = () => setIsQuestionSettingsOpen(true);
    const handleCloseSettingsModal = () => setIsQuestionSettingsOpen(false);

    const questionIndex = questions.findIndex(
        (q) => q[INT_QUESTION_ID] === question[INT_QUESTION_ID]
    );

    const settingParameters = [<QuestionConditionLogic question={question} />];

    const handleLoadQuestionList = async () => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/getQuestionList`)
            .then((response) => {
                setQuestionList(response.data);
            })
            .catch((error) => {
                console.error('Ошибка при получении списка вопросов:', error);
            });
    };

    // Получение опций и условной логики при смене вопроса
    useEffect(() => {
        if (question && question[QUESTION_ID] && question[INT_QUESTION_ID]) {
            // Загружаем опции и условия для текущего вопроса (если з)
            if (
                !question.options_of_question &&
                !question[QUESTION_ID].startsWith('tmp')
            ) {
                dispatch(fetchQuestionOptions(question[QUESTION_ID]));
            }
            if (
                !question.question_conditions &&
                !question[INT_QUESTION_ID].startsWith('tmp')
            ) {
                dispatch(fetchQuestionConditions(question[INT_QUESTION_ID]));
            }
        }
    }, [question]);

    // Подгружаем опции для вопросов, связанных с условиями текущего вопроса
    useEffect(() => {
        if (question.question_conditions) {
            question.question_conditions.forEach((condition) => {
                const operandQuestionId = condition.operand_question_id;

                // Проверяем, загружены ли опции для вопроса с данным operandQuestionId
                const relatedQuestion = questions.find(
                    (q) => q[INT_QUESTION_ID] === operandQuestionId
                );

                if (relatedQuestion && !relatedQuestion.options_of_question) {
                    dispatch(
                        fetchQuestionOptions(relatedQuestion[QUESTION_ID])
                    );
                }
            });
        }
    }, [question.question_conditions]);

    const handleCreateQuestion = useCallback((inputValue) => {
        console.log('Создание вопроса:', inputValue);
    }, []);

    const handleChangeQuestion = useCallback(
        (newValue, actionMeta) => {
            if (actionMeta.action === 'select-option') {
                const updatedQuestion = {
                    ...question,
                    [QUESTION_NAME]: newValue.label,
                    [QUESTION_ID]: newValue.value,
                };
                dispatch(updateQuestion(updatedQuestion));
                // Не проверяем на загруженные опции при смене вопроса
                if (!question[QUESTION_ID].startsWith('tmp')) {
                    dispatch(
                        fetchQuestionOptions(updatedQuestion[QUESTION_ID])
                    );
                }
                if (!question[INT_QUESTION_ID].startsWith('tmp')) {
                    dispatch(
                        fetchQuestionConditions(
                            updatedQuestion[INT_QUESTION_ID]
                        )
                    );
                }
                dispatch(selectQuestion(updatedQuestion));
            } else if (actionMeta.action === 'create-option') {
                handleCreateQuestion(newValue.label);
            }
        },
        [dispatch, question, handleCreateQuestion]
    );

    if (!question) {
        return <LoadingIndicator text="Загрузка деталей вопроса..." />;
    }

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Вопрос {questionIndex + 1}
            </Typography>
            <Box display="flex" alignItems="center" width="100%">
                <Box flex={1} mr={1}>
                    <CreatableSelect
                        onChange={handleChangeQuestion}
                        onCreateOption={handleCreateQuestion}
                        onFocus={handleLoadQuestionList}
                        createOptionPosition="first"
                        styles={{
                            menu: (provided) => ({ ...provided, zIndex: 9999 }),
                        }}
                        isClearable
                        value={
                            question[QUESTION_NAME]
                                ? {
                                      label: question[QUESTION_NAME],
                                      value: question[QUESTION_ID],
                                  }
                                : null
                        }
                        isMulti={false}
                        options={questionList.map((q) => ({
                            label: q[QUESTION_NAME],
                            value: q[QUESTION_ID],
                        }))}
                        placeholder="Выберите или создайте вопрос..."
                    />
                </Box>
            </Box>
            <Button
                onClick={handleOpenSettingsModal}
                variant="outlined"
                sx={{ mt: 2 }}
            >
                Настроить параметры
            </Button>
            <QuestionOptionsEditor parentQuestion={question} />
            <SettingsModal
                settingsParameters={settingParameters}
                open={isQuestionSettingsOpen}
                onClose={handleCloseSettingsModal}
                title={`Настройка вопроса ${questionIndex + 1}`}
            />
        </Box>
    );
};

export default SurveyQuestionEditor;
