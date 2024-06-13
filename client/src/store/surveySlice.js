import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { INT_QUESTION_ID, QUESTION_ID, OPTION_ID, QUESTION_NAME, QUESTION_OPTIONS } from '../constants';

// Асинхронное действие для получения опроса
export const fetchSurvey = createAsyncThunk(
    'survey/fetchSurvey',
    async (interviewId) => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/getInterviewQuestionList?interviewId=${interviewId}`);
        return response.json();
    }
);


// Асинхронное действие для получения опций вопроса
export const fetchQuestionOptions = createAsyncThunk(
    'survey/fetchQuestionOptions',
    async (question_id) => {
        if (question_id && !question_id.startsWith('tmp')) {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/getQuestionOptions?question_id=${question_id}`);
            return response.json();
        }
        return [];
    }
);

export const fetchQuestionConditions = createAsyncThunk(
    'survey/fetchQuestionConditions',
    async (question_of_interview_id) => {
        if (question_of_interview_id && !question_of_interview_id.startsWith('tmp')) {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/getQuestionConditions?question_of_interview_id=${question_of_interview_id}`);
            return response.json();
        }
        return [];
    }
);

const surveySlice = createSlice({
    name: 'survey',
    initialState: {
        interviewId: null,
        questions: [],
        // selectedQuestionDetails: {},
        selectedQuestion: null,
        status: 'idle',
        error: null,
    },
    reducers: {
        addQuestion: (state, action) => {
            state.questions.push({
                ...action.payload,
                isModified: true, 
            });
        },
        updateQuestion: (state, action) => {
            const index = state.questions.findIndex(q => q[INT_QUESTION_ID] === action.payload[INT_QUESTION_ID]);
            if (index !== -1) {
                state.questions[index] = {
                    ...action.payload,
                    isModified: true, 
                };
            }
        },
        selectQuestion: (state, action) => {
            state.selectedQuestion = action.payload;
            // console.log('selected question:', state.selectedQuestion)
        },

        setQuestionOption: (state, action) => {
            const { question_id, changedOption } = action.payload;
            const question = state.questions.find(q => q[QUESTION_ID] === question_id);
            if (question) {
                question.options_of_question = changedOption;
            }
        },
        addQuestionOption: (state, action) => {
            const { question_id, newOption } = action.payload;
            const question = state.questions.find(q => q[QUESTION_ID] === question_id);
            if (question) {
                question.options_of_question = question.options_of_question || [];
                question.options_of_question.push(newOption);
                question.isModified = true;
            }

        },
        updateQuestions: (state, action) => {
            state.questions = action.payload;
        },

        deleteQuestion: (state, action) => {
            state.questions = state.questions.filter(q => q[INT_QUESTION_ID] !== action.payload);
        },
        deleteOption: (state, action) => {
            const { question_id, option_id } = action.payload;
            const question = state.questions.find(q => q[QUESTION_ID] === question_id);
            if (question) {
                question.options_of_question = question.options_of_question.filter(option => option[OPTION_ID] !== option_id);
                question.isModified = true;
            }
        },
        reorderQuestions: (state, action) => {
            const { sourceIndex, destinationIndex } = action.payload;
            const [movedQuestion] = state.questions.splice(sourceIndex, 1);
            state.questions.splice(destinationIndex, 0, movedQuestion);
        },
        reorderOptions: (state, action) => {
            const { question_id, sourceIndex, destinationIndex } = action.payload;
            const question = state.questions.find(q => q[QUESTION_ID] === question_id);
            if (question) {
                const [movedOption] = question.options_of_question.splice(sourceIndex, 1);
                question.options_of_question.splice(destinationIndex, 0, movedOption);
                question.isModified = true;
            }
        },

        resetSurveyState: (state) => {
            state.interviewId = null;
            state.questions = [];
            state.selectedQuestion = null;
            state.status = 'idle';
            state.error = null;
        },

        markQuestionAsSaved: (state, action) => {
            const index = state.questions.findIndex(q => q[INT_QUESTION_ID] === action.payload[INT_QUESTION_ID]);
            if (index !== -1) {
                state.questions[index].isModified = false; // Сброс флага после сохранения
            }
        },

        addQuestionCondition: (state, action) => {
            const { question_of_interview_id, new_question_condition } = action.payload;
            const question = state.questions.find(q => q[INT_QUESTION_ID] === question_of_interview_id);
            if (question) {
                question.question_conditions = question.question_conditions || [];
                question.question_conditions.push(new_question_condition);
                question.isModified = true;
            }
        },
        addSelectedOptionToCondition: (state, action) => {
            const { question_of_interview_id, option, condition } = action.payload;
            const question = state.questions.find(q => q[INT_QUESTION_ID] === question_of_interview_id);
            if (question) {
                const foundCondition = question.question_conditions.find(cond => cond.operand_id === condition.operand_id);
                if (foundCondition) {
                    foundCondition.q_options.push(option);
                }
            }
            question.isModified = true;
        },

        deleteSelectedOptionFromCondition: (state, action) => {
            const { question_of_interview_id, optionId, condition } = action.payload;
            const question = state.questions.find(q => q[INT_QUESTION_ID] === question_of_interview_id);
            if (question) {
                const foundCondition = question.question_conditions.find(cond => cond.operand_id === condition.operand_id);
                if (foundCondition) {
                    foundCondition.q_options = foundCondition.q_options.filter(opt => opt.option_id !== optionId);
                }
            }
            question.isModified = true;
        },

        updateOperandCompareType: (state, action) => {
            const { question_of_interview_id, operandCompareType, condition } = action.payload;
            const question = state.questions.find(q => q[INT_QUESTION_ID] === question_of_interview_id);
            if (question) {
                const foundCondition = question.question_conditions.find(cond => cond.operand_id === condition.operand_id);
                if (foundCondition) {
                    foundCondition.operand_compare_type = operandCompareType;
                }
            }
            question.isModified = true;
        },

        updateOptionTextActivation: (state, action) => {
            const { question_of_interview_id, condition, option, new_option_text } = action.payload;
            const question = state.questions.find(q => q[INT_QUESTION_ID] === question_of_interview_id);
            if (question) {
                const foundCondition = question.question_conditions.find(cond => cond.operand_id === condition.operand_id);
                if (foundCondition) {
                    const foundOption = foundCondition.q_options.find(opt => opt.option_id === option.option_id);
                    if (foundOption) {
                        foundOption.text_activation = foundOption.text_activation || '';
                        foundOption.text_activation = new_option_text;
                    }
                }
            }
            question.isModified = true;
        },

        changeQuestionCondition: (state, action) => {
            const { question_of_interview_id, updated_condition } = action.payload;
            const question = state.questions.find(q => q[INT_QUESTION_ID] === question_of_interview_id);

            if (question) {
                const conditionIndex = question.question_conditions.findIndex(con => con.operand_id === updated_condition.operand_id);
                question.question_conditions[conditionIndex] = updated_condition;
                question.isModified = true;
            }
        },
        deleteQuestionCondition: (state, action) => {
            const { question_of_interview_id, operand_id } = action.payload;
            const question = state.questions.find(q => q[INT_QUESTION_ID] === question_of_interview_id);

            if (question) {
                question.question_conditions = question.question_conditions.filter(con => con.operand_id !== operand_id);
            }
        },


    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSurvey.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSurvey.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.questions = (action.payload || []).map(question => ({
                    ...question,
                    isModified: false,
                }));
                state.interviewId = action.meta.arg;
            })
            .addCase(fetchSurvey.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchQuestionOptions.fulfilled, (state, action) => {

                const question_id = action.meta.arg; // Используем question_id, который был передан в createAsyncThunk
                const questionToUpdate = state.questions.find(q => q[QUESTION_ID] === question_id);
                if (questionToUpdate) {
                    questionToUpdate.options_of_question = action.payload;
                }
            })
            .addCase(fetchQuestionConditions.fulfilled, (state, action) => {
                const question_of_interview_id = action.meta.arg; // Используем question_of_interview_id, который был передан в createAsyncThunk

                const questionToUpdate = state.questions.find(q => q[INT_QUESTION_ID] === question_of_interview_id);
                if (questionToUpdate) {
                    questionToUpdate.question_conditions = action.payload; 
                }
            });

    },
});

export const { addQuestion, updateQuestion, selectQuestion, setSelectedQuestionDetails, setQuestionOption, addQuestionOption, updateQuestions, updateOptions, resetSurveyState, markQuestionAsSaved, deleteOption, deleteQuestion, reorderQuestions, reorderOptions, updateQuestionConditions, addQuestionCondition, deleteQuestionCondition, changeQuestionCondition, addSelectedOptionToCondition, deleteSelectedOptionFromCondition, updateOperandCompareType, updateOptionTextActivation} = surveySlice.actions;

export default surveySlice.reducer;
