import React from 'react';
import { Box, TextField, IconButton, Button, Paper } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

/**
 * Компонент SurveyOptionFields отвечает за управление вариантами ответов в опросе.
 * Пользователь может добавлять, удалять и переупорядочивать варианты ответов.
 * Поддерживает возможность drag-and-drop для изменения порядка вариантов.
 *
 * @param {Object} props - Свойства компонента.
 * @param {Array} props.options - Массив вариантов ответов.
 * @param {string} props.pageId - Идентификатор страницы опроса.
 * @param {boolean} props.isMobile - Флаг, указывающий на мобильное устройство.
 * @param {Function} props.onChangeOption - Функция для обработки изменения текста варианта.
 * @param {Function} props.onDeleteOption - Функция для удаления варианта ответа.
 * @param {Function} props.onAddOption - Функция для добавления нового варианта ответа.
 * @param {Function} props.onOptionsDragEnd - Функция для обработки завершения перетаскивания варианта.
 * @param {boolean} [props.readOnly=false] - Опциональный флаг для отключения редактирования.
 */
const SurveyOptionFields = ({
    options,
    pageId,
    isMobile,
    onChangeOption,
    onDeleteOption,
    onAddOption,
    onOptionsDragEnd,
    readOnly = false,
}) => {
    /**
     * Генерирует уникальный идентификатор для варианта ответа на основе номера страницы и индекса варианта.
     * @param {string} pageId - Идентификатор страницы.
     * @param {number} index - Индекс варианта ответа.
     * @returns {string} - Идентификатор варианта ответа.
     */
    const generateOptionId = (pageId, index) => `opt_${pageId}_${index}`;

    /**
     * Обработчик для добавления нового варианта ответа.
     * Создает новый вариант с уникальным идентификатором и пустым значением, затем вызывает функцию onAddOption.
     */
    const handleAddOption = () => {
        const newOptionId = generateOptionId(pageId, options.length + 1);
        const newOption = { id: newOptionId, value: '' };
        onAddOption(newOption);
    };

    return (
        <div>
            {readOnly ? (
                <Box>
                    {options.map((option, index) => (
                        <Paper
                            key={`option-${option.id}`}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 1,
                                p: isMobile ? 1 : 2,
                            }}
                        >
                            <TextField
                                label={`Вариант ответа ${index + 1}`}
                                value={option.value}
                                size="small"
                                fullWidth
                                multiline
                                disabled
                            />
                        </Paper>
                    ))}
                </Box>
            ) : (
                <DragDropContext onDragEnd={onOptionsDragEnd}>
                    <Droppable droppableId="options">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {options.map((option, index) => (
                                    <Draggable key={`option-${option.id}`} draggableId={`option-${option.id}`} index={index}>
                                        {(provided) => (
                                            <Paper
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    mb: 1,
                                                    p: isMobile ? 1 : 2,
                                                }}
                                            >
                                                <TextField
                                                    label={`Вариант ответа ${index + 1}`}
                                                    value={option.value}
                                                    onChange={(e) => onChangeOption(option.id, e)}
                                                    size="small"
                                                    fullWidth
                                                    multiline
                                                />
                                                <IconButton
                                                    onClick={() => onDeleteOption(option.id)}
                                                    size={isMobile ? 'small' : 'medium'}
                                                    sx={{ ml: isMobile ? 1 : 2 }}
                                                >
                                                    <Delete fontSize={isMobile ? 'small' : 'medium'} />
                                                </IconButton>
                                            </Paper>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            )}
            {!readOnly && (
                <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<Add />}
                    onClick={handleAddOption}
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Добавить вариант
                </Button>
            )}
        </div>
    );
};

export default SurveyOptionFields;
