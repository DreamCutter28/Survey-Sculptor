import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, IconButton } from '@mui/material';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import { ExpandMore, ChevronRight, Delete } from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { QUESTION_ID, INT_QUESTION_ID, QUESTION_NAME } from '../constants';
import {
    selectQuestion,
    reorderQuestions,
    deleteQuestion,
} from '../store/surveySlice';

const SurveyNavigator = () => {
    const dispatch = useDispatch();
    const { questions } = useSelector((state) => state.survey);

    const handlePageClick = (question_of_interview_id, question_id) => {
        dispatch(selectQuestion({ question_of_interview_id, question_id }));
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        console.log('Drag result:', result);

        dispatch(
            reorderQuestions({
                sourceIndex: result.source.index,
                destinationIndex: result.destination.index,
            })
        );
    };

    const handleDeleteQuestion = (question) => {
        const currentQuestionIndex = questions.findIndex(
            (q) => q[INT_QUESTION_ID] === question[INT_QUESTION_ID]
        );

        dispatch(deleteQuestion(question[INT_QUESTION_ID]));

        // Выбираем предыдущий/следующий вопрос при удалении текущего
        const previousQuestion = questions[currentQuestionIndex - 1];
        const nextQuestion = questions[currentQuestionIndex + 1];

        const questionToDisplay = previousQuestion
            ? previousQuestion
            : nextQuestion
            ? nextQuestion
            : null;

        const formattedQuestion = questionToDisplay
            ? {
                  question_of_interview_id: questionToDisplay[INT_QUESTION_ID],
                  question_id: questionToDisplay[QUESTION_ID],
              }
            : null;

        dispatch(selectQuestion(formattedQuestion));
    };

    const renderPageTree = () => (
        <SimpleTreeView
            defaultcollapseicon={<ExpandMore />}
            defaultexpandicon={<ChevronRight />}
        >
            <TreeItem itemId="root" label="Опрос">
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="questions">
                        {(provided) => (
                            <Box
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {questions.map((question, index) => (
                                    <Draggable
                                        key={question[INT_QUESTION_ID]}
                                        draggableId={question[INT_QUESTION_ID]}
                                        index={index}
                                    >
                                        {(provided) => (
                                            <Box
                                                display="flex"
                                                alignItems="center"
                                                width="100%"
                                                position="relative"
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                sx={{
                                                    backgroundColor:
                                                        question.isModified
                                                            ? 'rgba(255, 0, 0, 0.1)'
                                                            : 'transparent',
                                                    padding: '8px',
                                                    margin: '2px',
                                                    borderRadius: '4px',
                                                }}
                                            >
                                                <TreeItem
                                                    itemId={
                                                        question[
                                                            INT_QUESTION_ID
                                                        ]
                                                    }
                                                    label={
                                                        question[
                                                            QUESTION_NAME
                                                        ] ||
                                                        `Вопрос ${index + 1}`
                                                    }
                                                    onClick={() =>
                                                        handlePageClick(
                                                            question[
                                                                INT_QUESTION_ID
                                                            ],
                                                            question[
                                                                QUESTION_ID
                                                            ]
                                                        )
                                                    }
                                                    sx={{ flexGrow: 1 }}
                                                />
                                                <IconButton
                                                    onClick={() =>
                                                        handleDeleteQuestion(
                                                            question
                                                        )
                                                    }
                                                    size="small"
                                                    sx={{
                                                        position: 'absolute',
                                                        top: -7,
                                                        right: -7,
                                                        margin: '4px',

                                                        backgroundColor:
                                                            'white', // Дополнительный стиль, чтобы иконка выделялась на любом фоне
                                                        '&:hover': {
                                                            backgroundColor:
                                                                'rgba(255, 0, 0, 0.2)', // Изменение цвета при наведении
                                                        },
                                                    }}
                                                >
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </Box>
                        )}
                    </Droppable>
                </DragDropContext>
            </TreeItem>
        </SimpleTreeView>
    );

    return <>{renderPageTree()}</>;
};

export default SurveyNavigator;
