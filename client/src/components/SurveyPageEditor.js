// SurveyPageEditor.js
import React from 'react';
import { Typography, Box, TextField, Button, Select, MenuItem, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import SurveyOptionFields from './SurveyOptionFields';

/**
 * Редактор отдельной страницы в опросе.
 * Позволяет редактировать текст вопроса, тип ответа, варианты ответа, и добавляет условную логику.
 * @param {Object} props - Свойства компонента.
 * @param {Object} props.selectedPageData - Данные текущей выбранной страницы.
 * @param {number} props.selectedPageIndex - Индекс текущей выбранной страницы.
 * @param {boolean} props.isMobile - Устройство с мобильным экраном.
 * @param {Function} props.onChangeQuestion - Обработчик изменения текста вопроса.
 * @param {Function} props.onDeletePage - Обработчик удаления страницы.
 * @param {Function} props.onChangePageType - Обработчик изменения типа ответа.
 * @param {Function} props.onChangeOption - Обработчик изменения варианта ответа.
 * @param {Function} props.onDeleteOption - Обработчик удаления варианта ответа.
 * @param {Function} props.onAddOption - Обработчик добавления нового варианта ответа.
 * @param {Function} props.onOptionsDragEnd - Обработчик изменения порядка вариантов ответа.
 * @param {Function} props.onOpenLogicModal - Открыть модальное окно для настройки логики.
 */
const SurveyPageEditor = ({
    selectedPageData,
    selectedPageIndex,
    isMobile,
    onChangeQuestion,
    onDeletePage,
    onChangePageType,
    onChangeOption,
    onDeleteOption,
    onAddOption,
    onOptionsDragEnd,
    onOpenLogicModal,
}) => {
    if (!selectedPageData) return null;

    return (
        <div>
            <Typography variant="h5" gutterBottom>
                Вопрос {selectedPageIndex}
            </Typography>
            <Box display="flex" alignItems="center">
                {/* Поле ввода для текста вопроса */}
                <TextField
                    label="Текст вопроса"
                    value={selectedPageData.question}
                    onChange={onChangeQuestion}
                    fullWidth
                    margin="dense"
                    multiline
                />
                {/* Кнопка для удаления текущей страницы */}
                <IconButton onClick={onDeletePage} size="small" sx={{ ml: 1 }}>
                    <Delete fontSize="small" />
                </IconButton>
            </Box>
            {/* Селектор типа ответа */}
            <Typography variant="h6" gutterBottom>
                Тип ответа:
            </Typography>
            <Select
                value={selectedPageData.type}
                onChange={onChangePageType}
                fullWidth
                margin="dense"
            >
                <MenuItem value="text">Текстовый ответ</MenuItem>
                <MenuItem value="single">Выбор (1 вариант ответа)</MenuItem>
                <MenuItem value="multiple">Выбор (несколько вариантов)</MenuItem>
            </Select>
            {/* Поля для редактирования вариантов ответа */}
            {['single', 'multiple'].includes(selectedPageData.type) && (
                <SurveyOptionFields
                    options={selectedPageData.options}
                    isMobile={isMobile}
                    onChangeOption={onChangeOption}
                    onDeleteOption={onDeleteOption}
                    onAddOption={onAddOption}
                    onOptionsDragEnd={onOptionsDragEnd}
                />
            )}
            {/* Кнопка для открытия модального окна настройки логики */}
            <Button onClick={onOpenLogicModal} variant="outlined" sx={{ mt: 2 }}>
                Настроить логику
            </Button>
        </div>
    );
};

export default SurveyPageEditor;
