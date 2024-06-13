import React from 'react';
import { Delete, ExpandMore } from '@mui/icons-material';
import {
    Select,
    MenuItem,
    IconButton,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import {
    addQuestionCondition,
    deleteQuestionCondition,
} from '../store/surveySlice';
import { useDispatch, useSelector } from 'react-redux';
import {
    INT_QUESTION_ID,
    QUESTION_NAME,
    QUESTION_CONDITIONS,
} from '../constants';
import { v4 as uuidv4 } from 'uuid';
import QuestionConditionItems from './QuestionConditionItems';
import SettingsParameterWrapper from './SettingsParameterWrapper';

const QuestionConditionLogic = ({ question }) => {
    const dispatch = useDispatch();
    const { selectedQuestion, questions, interviewId } = useSelector(
        (state) => state.survey
    );

    const handleAddCondition = (event) => {
        const newQuestionOfInterviewId = event.target.value;

        const newCondition = {
            operand_id: 'tmp_' + uuidv4(),
            operand_question_id: newQuestionOfInterviewId,
            operand_compare_type: '1', // Начальный тип сравнения
            q_options: [],
        };

        dispatch(
            addQuestionCondition({
                question_of_interview_id: question[INT_QUESTION_ID],
                new_question_condition: newCondition,
            })
        );
    };

    const handleDeleteCondition = (question_of_interview_id, operand_id) => {
        dispatch(
            deleteQuestionCondition({
                question_of_interview_id: question_of_interview_id,
                operand_id: operand_id,
            })
        );
    };

    // Получаем массив идентификаторов вопросов из currentQuestion.question_conditions
    const existingQuestionIds = question.question_conditions?.map(
        (condition) => condition.operand_question_id
    );

    // Фильтруем questions, исключая вопросы, которые уже есть в currentQuestion.question_conditions
    // и также исключая текущий вопрос
    const filteredQuestionList = questions.filter(
        (question) =>
            !existingQuestionIds?.includes(question[INT_QUESTION_ID]) &&
            question[INT_QUESTION_ID] !== selectedQuestion[INT_QUESTION_ID]
    );

    const parameterDetailsComponent = (
        <>
            <Select
                value={''} // Очищаем поле поиска после выбора
                onChange={handleAddCondition}
                displayEmpty
                renderValue={() => 'Добавить зависимость...'} // Отображение плейсхолдера
                sx={{
                    width: '100%',
                    mb: 2,
                }}
            >
                {filteredQuestionList.map((q) => (
                    <MenuItem
                        key={q[INT_QUESTION_ID]}
                        value={q[INT_QUESTION_ID]}
                    >
                        {q[QUESTION_NAME]}
                    </MenuItem>
                ))}
            </Select>

            {question[QUESTION_CONDITIONS]?.map((condition, index) => {
                if (condition.operand_question_id) {
                    const dependencyQuestion = questions.find(
                        (q) =>
                            q[INT_QUESTION_ID] === condition.operand_question_id
                    );
                    if (dependencyQuestion) {
                        return (
                            <Accordion
                                key={dependencyQuestion[INT_QUESTION_ID]}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMore />}
                                    aria-controls={`panel-${dependencyQuestion[INT_QUESTION_ID]}-content`}
                                    id={`panel-${dependencyQuestion[INT_QUESTION_ID]}-header`}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        backgroundColor:
                                            index % 2 === 0
                                                ? '#f0f0f0'
                                                : '#e0e0e0',
                                    }}
                                >
                                    <Typography sx={{ flexGrow: 1 }}>
                                        {dependencyQuestion[QUESTION_NAME]}
                                    </Typography>
                                    <IconButton
                                        onClick={() => {
                                            handleDeleteCondition(
                                                question[INT_QUESTION_ID],
                                                condition.operand_id
                                            );
                                        }}
                                        sx={{ ml: 2 }}
                                    >
                                        <Delete />
                                    </IconButton>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <QuestionConditionItems
                                        question={question}
                                        dependencyQuestion={dependencyQuestion}
                                        condition={condition}
                                    />
                                </AccordionDetails>
                            </Accordion>
                        );
                    }
                }
                return null;
            })}
        </>
    );

    return (
        <SettingsParameterWrapper
            parameterHeader="Настройка условной логики"
            parametersDetailComponents={[parameterDetailsComponent]}
        />
    );
};

export default QuestionConditionLogic;
