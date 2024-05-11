import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Box, Typography, Button, Checkbox, Grid, FormControlLabel, Divider, Paper, TextField } from '@mui/material';
import CreatableSelect from 'react-select/creatable';

/**
 * Модальное окно для настройки условной логики в опросе.
 * Позволяет настроить логику активации вопроса.
 *
 * @param {Object} props - Свойства компонента.
 * @param {boolean} props.open - Состояние видимости модального окна.
 * @param {Function} props.onClose - Функция для закрытия модального окна.
 * @param {Function} props.onSaveLogic - Функция для сохранения настроенной логики.
 * @param {Array} props.pages - Список всех страниц опроса для выбора зависимостей.
 * @param {string} props.currentPageId - ID текущей редактируемой страницы.
 * @param {Array} props.logic - Текущая логика условий, установленная для страницы.
 * Элементы массива logic представляют собой объекты с следующей структурой:
 *   - questionId: идентификатор вопроса, от ответа на который зависит текущая страница.
 *   - selectedOptions: массив идентификаторов выбранных опций ответа на вопрос questionId,
 *     которые активируют логическую зависимость.
 */

const SurveyLogicModal = ({ open, onClose, onSaveLogic, pages = [], currentPageId, logic = [] }) => {
    const [dependencies, setDependencies] = useState([]); // Список идентификаторов страниц, от которых зависит текущий вопрос
    const [selectedOptions, setSelectedOptions] = useState({}); // Состояние выбранных вариантов ответов для каждой зависимости

    // Инициализация состояний при первом рендере или изменении логики
    useEffect(() => {
        const initialDependencies = logic.map((condition) => condition.questionId);
        const initialOptions = logic.reduce((acc, condition) => {
            const selectedMap = condition.selectedOptions.reduce((map, id) => ({ ...map, [id]: true }), {});
            return { ...acc, [condition.questionId]: selectedMap };
        }, {}); // Преобразование массива выбранных опций в объект, где каждая опция представлена ключом с значением true (опция выбрана)
        setDependencies(initialDependencies);
        setSelectedOptions(initialOptions);
    }, [logic]);

    // Обработчик изменения зависимостей
    const handleDependencyChange = (newValues) => {
        const newDependencies = newValues.map((value) => value.value);
        const updatedOptions = newDependencies.reduce(
            (acc, dep) => ({ ...acc, [dep]: selectedOptions[dep] || {} }),
            {}
        );
        setDependencies(newDependencies);
        setSelectedOptions(updatedOptions);
    };

    // Обработчик переключения выбранных опций ответов
    const handleOptionToggle = (dependencyId, optionId) => {
        setSelectedOptions((prev) => ({
            ...prev,
            [dependencyId]: {
                ...prev[dependencyId],
                [optionId]: !prev[dependencyId]?.[optionId],
            },
        }));
    };

    // Функция сохранения измененной логики и закрытия модального окна
    const handleSave = () => {
        const selectedOptionsList = dependencies.map((dep) => ({
            questionId: dep,
            selectedOptions: Object.keys(selectedOptions[dep] || {}).filter((key) => selectedOptions[dep][key]),
        }));
        onSaveLogic(currentPageId, selectedOptionsList);
        onClose();
    };

    // Подготовка опций для выбора зависимостей, исключая текущий вопрос
    const pageOptions = pages
        .filter((page) => page.id !== currentPageId)
        .map((page) => ({
            value: page.id,
            label: page.question || `Вопрос ${page.id}`,
        }));

    // Вычисление доступных вариантов ответа для каждой зависимости
    const availableOptions = useMemo(
        () => dependencies.reduce((acc, dep) => {
            const pageOptions = pages.find((page) => page.id === dep)?.options || [];
            return { ...acc, [dep]: pageOptions };
        }, {}),
        [dependencies, pages]
    );

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    width: '90%',
                    maxWidth: 600,
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    margin: 'auto',
                    bgcolor: 'background.paper',
                    p: 3,
                    mt: 10,
                }}
            >
                <Typography variant="h6">Настроить условную логику</Typography>
                <Typography variant="subtitle1">Зависит от:</Typography>
                <CreatableSelect
                    options={pageOptions}
                    isMulti
                    onChange={handleDependencyChange}
                    value={dependencies.map((dep) => ({
                        value: dep,
                        label: pages.find((page) => page.id === dep)?.question || `Вопрос ${dep}`,
                    }))}
                    isClearable={false}
                    placeholder="Введите или выберите вопросы..."
                    menuPortalTarget={document.body}
                    styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                    isValidNewOption={() => false}
                />
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    {dependencies.map((dep) => {
                        const questionName = pages.find((page) => page.id === dep)?.question || `Вопрос ${dep}`;
                        return (
                            <Grid item xs={12} key={dep}>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="subtitle1">{questionName}</Typography>
                                <Grid container spacing={1} alignItems="center">
                                    {availableOptions[dep]?.map((option, optIndex) => (
                                        <React.Fragment key={option.id}>
                                            <Grid item xs={8}>
                                                <Paper
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        mb: 1,
                                                        p: 2,
                                                    }}
                                                >
                                                    <TextField
                                                        label={`Вариант ответа ${optIndex + 1}`} // Динамически обновляем метку
                                                        value={option.value}
                                                        size="small"
                                                        fullWidth
                                                        multiline
                                                        disabled
                                                    />
                                                </Paper>
                                            </Grid>
                                            <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center' }}>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={!!selectedOptions[dep]?.[option.id]}
                                                            onChange={() => handleOptionToggle(dep, option.id)}
                                                        />
                                                    }
                                                    sx={{ alignSelf: 'center' }}
                                                />
                                            </Grid>
                                        </React.Fragment>
                                    ))}
                                </Grid>
                            </Grid>
                        );
                    })}
                </Grid>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                    <Button onClick={onClose} variant="outlined">
                        Отмена
                    </Button>
                    <Button onClick={handleSave} variant="contained">
                        Сохранить
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default SurveyLogicModal;
