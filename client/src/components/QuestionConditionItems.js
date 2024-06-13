import React from 'react';
import {
    Select,
    MenuItem,
    Box,
    Typography,
    Checkbox,
    TextField,
} from '@mui/material';
import {
    updateOperandCompareType,
    updateOptionTextActivation as updateOptionTextActivation,
    addSelectedOptionToCondition,
    deleteSelectedOptionFromCondition,
} from '../store/surveySlice';
import { useDispatch } from 'react-redux';
import {
    OPTION_ID,
    OPTION_TEXT,
    OPTION_TYPE,
    INT_QUESTION_ID,
} from '../constants';
import { debounce } from 'lodash';

const QuestionConditionItems = ({
    question,
    dependencyQuestion,
    condition,
}) => {
    const dispatch = useDispatch();
    const depOptions = dependencyQuestion?.options_of_question || [];

    // Обработчик изменения текста
    const delayedHandleTextChange = debounce(
        (new_option_text, condition, option) => {
            dispatch(
                updateOptionTextActivation({
                    question_of_interview_id: question[INT_QUESTION_ID],
                    condition: condition,
                    option: option,
                    new_option_text: new_option_text,
                })
            );
        },
        500
    );

    const settings = {
        textItemSettings: [
            {
                label: 'Текстовый ввод пользователя',
                placeholder: 'Активируется при вводе...',
                isDisabled: false,
            },
        ],
        textChoiceSettings: [
            {
                label: 'Вариант ответа',
                placeholder: 'Выберите вариант ответа...',
                isDisabled: true,
            },
        ],
        keyValueSettings: [
            {
                label: 'Вариант ответа',
                placeholder: 'Выберите вариант ответа...',
                isDisabled: false,
            },
            {
                label: 'Значение параметра пользователя',
                placeholder: 'Активируется при вводе...',
                isDisabled: false,
            },
        ],
    };

    const isChecked = (option, condition) => {
        if (!question || !dependencyQuestion || !condition) {
            return false;
        }

        // Проверяем, есть ли данная опция в списке опций в условии
        return condition.q_options.some(
            (q_option) => q_option.option_id === option[OPTION_ID]
        );
    };

    const handleCheckboxChange = (option, condition) => {
        if (isChecked(option, condition)) {
            dispatch(
                deleteSelectedOptionFromCondition({
                    question_of_interview_id: question[INT_QUESTION_ID],
                    optionId: option[OPTION_ID],
                    condition: condition,
                })
            );
        } else {
            dispatch(
                addSelectedOptionToCondition({
                    question_of_interview_id: question[INT_QUESTION_ID],
                    option: option,
                    condition: condition,
                })
            );
        }
    };

    const handleOperandCompareTypeChange = (operandCompareType) => {
        dispatch(
            updateOperandCompareType({
                question_of_interview_id: question[INT_QUESTION_ID],
                operandCompareType: operandCompareType,
                condition: condition,
            })
        );
    };

    const selectOptions = [
        { label: 'минимум один выбранный ответ', value: '1' },
        { label: 'все выбранные ответы', value: '2' },
    ];

    const getComparisonType = () => {
        return (
            selectOptions.find(
                (opt) => opt.value === condition.operand_compare_type
            ).value || '1'
        );
    };

    const settingsByType = {
        0: settings.textItemSettings,
        1: settings.textChoiceSettings,
        2: settings.keyValueSettings,
    };

    const renderOption = (option, index) => {
        const type = option[OPTION_TYPE];

        const currentSettings = settingsByType[option[OPTION_TYPE]] || [];

        const labelText = currentSettings[0]?.label;
        const isDisabled = currentSettings[0]?.isDisabled;
        const placeholder = currentSettings[0]?.placeholder;
        const labelTextSecond = currentSettings[1]?.label;
        const isDisabledSecond = currentSettings[1]?.isDisabled;
        const placeholderSecond = currentSettings[1]?.placeholder;

        switch (type) {
            case '0':
                return (
                    <Box
                        display="flex"
                        alignItems="center"
                        width="100%"
                        key={option[OPTION_ID]}
                        mt={1}
                    >
                        <Checkbox
                            checked={isChecked(option, condition)}
                            onChange={() =>
                                handleCheckboxChange(option, condition)
                            }
                        />
                        <TextField
                            label={`${labelText} ${index + 1}`}
                            placeholder={option[OPTION_TEXT]}
                            fullWidth
                            disabled={isDisabled}
                            defaultValue={
                                condition.q_options.find(
                                    (opt) => opt.option_id === option.option_id
                                )?.text_activation
                            }
                            onChange={(e) =>
                                delayedHandleTextChange(
                                    e.target.value,
                                    condition,
                                    option
                                )
                            }
                        />
                    </Box>
                );

            case '1':
                return (
                    <Box
                        display="flex"
                        alignItems="center"
                        width="100%"
                        key={option[OPTION_ID]}
                        mt={1}
                    >
                        <Checkbox
                            checked={isChecked(option, condition)}
                            onChange={() =>
                                handleCheckboxChange(option, condition)
                            }
                        />
                        <TextField
                            label={`${labelText} ${index + 1}`}
                            value={option[OPTION_TEXT]}
                            disabled={isDisabled}
                            fullWidth
                        />
                    </Box>
                );

            case '2':
                // const foundOption = condition.q_options.find(opt => opt.option_id === option.option_id);
                return (
                    <Box
                        display="flex"
                        alignItems="center"
                        width="100%"
                        key={option[OPTION_ID]}
                        mt={1}
                    >
                        <Checkbox
                            checked={isChecked(option, condition)}
                            onChange={() =>
                                handleCheckboxChange(option, condition)
                            }
                        />
                        <Typography>
                            {option[OPTION_TEXT] || 'Имя параметра'}
                        </Typography>
                        <TextField
                            label={`${labelTextSecond} ${index + 1}`}
                            placeholder={placeholderSecond}
                            fullWidth
                            disabled={isDisabledSecond}
                            sx={{ marginLeft: 2 }}
                            defaultValue={
                                condition.q_options.find(
                                    (opt) => opt.option_id === option.option_id
                                )?.text_activation
                            }
                            onChange={(e) =>
                                delayedHandleTextChange(
                                    e.target.value,
                                    condition,
                                    option
                                )
                            }
                        />
                    </Box>
                );

            default:
                return (
                    <Typography
                        variant="body1"
                        color="error"
                        key={option[OPTION_ID]}
                    >
                        Возникла ошибка с типом ответа.
                    </Typography>
                );
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ mr: 2 }}>
                    Активация при:
                </Typography>
                <Select
                    size="small"
                    sx={{ minWidth: 120 }}
                    value={getComparisonType()}
                    onChange={(event) =>
                        handleOperandCompareTypeChange(event.target.value)
                    }
                    options={selectOptions}
                >
                    {selectOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </Box>

            {/* Отображение опций */}
            {depOptions.map((option, index) => (
                <Box key={option[OPTION_ID]} mt={1}>
                    {renderOption(option, index)}
                </Box>
            ))}

            {/* Сообщение об ошибке, если нет опций */}
            {!depOptions.length && (
                <Typography variant="body1" color="error">
                    Возникла ошибка с типом ответа.
                </Typography>
            )}
        </Box>
    );
};

export default QuestionConditionItems;
