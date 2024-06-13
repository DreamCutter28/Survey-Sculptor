import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    TextField,
    InputLabel,
    Typography,
} from '@mui/material';
import CreatableSelect from 'react-select/creatable';
import {
    QUESTION_ID,
    OPTION_ID,
    OPTION_TEXT,
    OPTION_TYPE,
    QUESTION_OPTIONS,
} from '../constants';
import { useDispatch, useSelector } from 'react-redux';
import {
    setQuestionOption,

} from '../store/surveySlice';
import axios from 'axios';

const OptionItem = ({
    index,
    parentQuestion,
    option,
    settings = {
        textItemSettings: [
            {
                label: 'Текстовый ввод пользователя',
                placeholder: 'Введите подсказку для пользователя...',
                isDisabled: false,
            },
        ],
        textChoiceSettings: [
            {
                label: 'Вариант ответа',
                placeholder: 'Выберите вариант ответа...',
                isDisabled: false,
            },
        ],
        keyValueSettings: [
            {
                label: 'Вариант ответа',
                placeholder: 'Выберите вариант ответа...',
                isDisabled: false,
            },
            {
                label: 'Текстовый ввод пользователя',
                placeholder: 'Пользовательский ввод',
                isDisabled: true,
            },
        ],
    },
}) => {
    const [optionList, setOptionList] = useState({});
    const [inputValues, setInputValues] = useState({});

    const dispatch = useDispatch();


    const handleChangeOption = (optionId, newValue) => {
        const updatedOption = (parentQuestion[QUESTION_OPTIONS] || []).map(
            (option) =>
                option[OPTION_ID] === optionId
                    ? {
                          ...option,
                          [OPTION_TEXT]: newValue ? newValue.label : '',
                      }
                    : option
        );

        dispatch(
            setQuestionOption({
                question_id: parentQuestion[QUESTION_ID],
                changedOption: updatedOption,
            })
        );
    };

    const handleLoadOptionListByQuestion = async (question_id, optionType) => {
        axios
            .get(
                `${process.env.REACT_APP_API_URL}/getOptionListByQuestion?questionId=${question_id}&optionType=${optionType}`
            )
            .then((response) => {
                const formattedOptions = response.data.map((option) => ({
                    label: option.option_text,
                    value: option.option_id,
                }));
                setOptionList((prevState) => {
                    const newState = {
                        ...prevState,
                        [optionType]: formattedOptions,
                    };
                    // console.log('New optionList state:', newState);
                    return newState;
                });
            })
            .catch((error) => {
                console.error('Ошибка при получении опций вопроса:', error);
            });
    };

    const handleLoadOptionListByType = async (optionType) => {
        axios
            .get(
                `${process.env.REACT_APP_API_URL}/getOptionListByType?optionType=${optionType}`
            )
            .then((response) => {
                const formattedOptions = response.data.map((option) => ({
                    label: option.option_text,
                    value: option.option_id,
                }));
                setOptionList((prevState) => {
                    const newState = {
                        ...prevState,
                        [optionType]: formattedOptions,
                    };
                    // console.log('New optionList state:', newState);
                    return newState;
                });
            })
            .catch((error) => {
                console.error('Ошибка при получении опций вопроса:', error);
            });
    };

    const handleLoadOptionList = (option) => {
        if (
            parentQuestion[QUESTION_ID] &&
            !parentQuestion[QUESTION_ID].startsWith('tmp') &&
            !option[OPTION_ID].startsWith('tmp')
        ) {
            handleLoadOptionListByQuestion(
                parentQuestion[QUESTION_ID],
                option[OPTION_TYPE]
            );
        } else if (option[OPTION_TYPE]) {
            handleLoadOptionListByType(option[OPTION_TYPE]);
        }
    };

    const selectedOption =
        option[OPTION_TEXT] && option[OPTION_ID]
            ? { label: option[OPTION_TEXT], value: option[OPTION_ID] }
            : null;

    const filterOptions = (candidate, inputValue) => {
        if (inputValue.length >= 2) {
            return candidate.label
                .toLowerCase()
                .includes(inputValue.toLowerCase());
        }
        return false;
    };

    const customStyles = {
        container: (provided) => ({
            ...provided,
            flex: 1,
            marginRight: option[OPTION_TYPE] === '2' ? '8px' : '0',
        }),
        menu: (provided) => ({ ...provided, zIndex: 9999 }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.data.__isNew__
                ? 'lightblue'
                : provided.color,
        }),
    };

    const settingsByType = {
        0: settings.textItemSettings,
        1: settings.textChoiceSettings,
        2: settings.keyValueSettings,
    };

    const currentSettings = settingsByType[option[OPTION_TYPE]] || [];

    const labelText = currentSettings[0]?.label;
    const isDisabled = currentSettings[0]?.isDisabled;
    const placeholder = currentSettings[0]?.placeholder;
    const labelTextSecond = currentSettings[1]?.label;
    const isDisabledSecond = currentSettings[1]?.isDisabled;
    const placeholderSecond = currentSettings[1]?.placeholder;

    if (!labelText) {
        return (
            <Typography variant="body1" color="error">
                Возникла ошибка с типом ответа.
            </Typography>
        );
    }

    return (
        <Box
            display="flex"
            alignItems="center"
            width="100%"
            key={option[OPTION_ID]}
        >
            <Box flex={1} mr={1}>
                <InputLabel shrink>{`${labelText} ${index + 1}`}</InputLabel>
                <CreatableSelect
                    onFocus={() => handleLoadOptionList(option)}
                    options={optionList[option[OPTION_TYPE]]}
                    isClearable
                    value={selectedOption}
                    onChange={
                        isDisabled
                            ? undefined
                            : (newValue) =>
                                  handleChangeOption(
                                      option[OPTION_ID],
                                      newValue
                                  )
                    }
                    isDisabled={isDisabled}
                    placeholder={placeholder}
                    styles={customStyles}
                    filterOption={(candidate) =>
                        filterOptions(
                            candidate,
                            inputValues[option[OPTION_ID]] || ''
                        )
                    }
                    formatCreateLabel={(inputValue) =>
                        `Создать "${inputValue}"`
                    }
                    inputValue={inputValues[option[OPTION_ID]] || ''}
                    onInputChange={(newValue) =>
                        setInputValues((prevState) => ({
                            ...prevState,
                            [option[OPTION_ID]]: newValue,
                        }))
                    }
                    createOptionPosition="first"
                />
            </Box>
            {option[OPTION_TYPE] === '2' && (
                <Box flex={1}>
                    <InputLabel shrink>{`${labelTextSecond} ${
                        index + 1
                    }`}</InputLabel>
                    <TextField
                        placeholder={placeholderSecond}
                        size="small"
                        fullWidth
                        multiline
                        disabled={isDisabledSecond}
                    />
                </Box>
            )}
        </Box>
    );
};

export default OptionItem;
