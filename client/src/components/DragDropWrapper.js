import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Paper, Box } from '@mui/material';
import DragHandle from '@mui/icons-material/DragHandle';

const DragDropWrapper = ({ items, renderItem, onDragEnd }) => {
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable-items">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {items.map((item, index) => (
                            <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                            >
                                {(provided) => (
                                    <Paper
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            mb: 1,
                                            p: 2,
                                        }}
                                    >
                                        <Box
                                            {...provided.dragHandleProps}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                mr: 2,
                                            }}
                                        >
                                            <DragHandle />
                                        </Box>
                                        {renderItem(item, provided, index)}
                                    </Paper>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default DragDropWrapper;
