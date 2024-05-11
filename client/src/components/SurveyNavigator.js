import React from 'react';
import { Button, Box } from '@mui/material';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import { ExpandMore, ChevronRight, Add } from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

/**
 * Компонент SurveyNavigator для навигации по страницам опроса.
 * Позволяет выбирать страницы для редактирования, добавлять новые страницы и переупорядочивать существующие страницы с помощью перетаскивания.
 * 
 * @param {Object} props - Свойства компонента.
 * @param {Object} props.survey - Объект опроса, содержащий информацию о страницах и вопросах.
 * @param {Function} props.onPageClick - Функция, вызываемая при клике на страницу опроса.
 * @param {Function} props.onAddPage - Функция для добавления новой страницы в опрос.
 * @param {Function} props.onDragEnd - Функция обработки окончания перетаскивания страницы.
 */
const SurveyNavigator = ({ survey, onPageClick, onAddPage, onDragEnd }) => {
    if (!survey) {
        return null; // Если нет данных опроса, компонент не отображается
    }

    /**
     * Функция для отображения дерева страниц в формате дерева с возможностью перетаскивания.
     * @returns {React.JSX.Element} Элементы дерева страниц.
     */
    const renderPageTree = () => (
        <SimpleTreeView
            defaultсollapseicon={<ExpandMore />}
            defaultexpandicon={<ChevronRight />}
        >
            <TreeItem itemId="root" label={survey?.name || 'Новый опрос'}>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="pages">
                        {(provided) => (
                            <Box ref={provided.innerRef} {...provided.droppableProps}>
                                {survey.pages.map((page, index) => (
                                    <Draggable key={page.id} draggableId={page.id} index={index}>
                                        {(provided) => (
                                            <Box
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <TreeItem
                                                    itemId={page.id}
                                                    label={page.question || `Вопрос ${index + 1}`}
                                                    onClick={() => onPageClick(page.id)}
                                                />
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

    return (
        <>
            {renderPageTree()} 
            <Box sx={{ position: 'sticky', bottom: 0, mt: 2, mb: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={onAddPage}
                    fullWidth
                >
                    Добавить вопрос
                </Button>
            </Box>
        </>
    );
};

export default SurveyNavigator;
