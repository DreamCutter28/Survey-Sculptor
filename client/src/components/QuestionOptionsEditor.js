import React, { useState } from 'react';
import { Box, IconButton, Button } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import {
    QUESTION_ID,
    OPTION_ID,
    OPTION_TEXT,
    OPTION_TYPE,
    INT_QUESTION_ID,
} from '../constants';
import { useDispatch } from 'react-redux';
import {
    addQuestionOption,
    deleteOption,
    reorderOptions,
} from '../store/surveySlice';
import OptionItem from './OptionItem';
import OptionTypeDialog from './OptionTypeDialog';
import DragDropWrapper from './DragDropWrapper';

const QuestionOptionsEditor = ({ parentQuestion }) => {
    const dispatch = useDispatch();
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleAddOption = (optionType) => {
        const newOptionId = `tmp_opt_${parentQuestion[INT_QUESTION_ID]}_${
            options.length + 1
        }`;
        const newOption = {
            [OPTION_ID]: newOptionId,
            [OPTION_TEXT]: '',
            [OPTION_TYPE]: optionType,
        };

        dispatch(
            addQuestionOption({
                question_id: parentQuestion[QUESTION_ID],
                newOption: newOption,
            })
        );

        setDialogOpen(false);
    };

    const handleOpenDialog = () => {
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const options = parentQuestion?.options_of_question || [];

    const handleOptionsDragEnd = (result) => {
        if (!result.destination) return;

        dispatch(
            reorderOptions({
                question_id: parentQuestion[QUESTION_ID],
                sourceIndex: result.source.index,
                destinationIndex: result.destination.index,
            })
        );
    };

    const handleDeleteOption = (optionId) => {
        dispatch(
            deleteOption({
                question_id: parentQuestion[QUESTION_ID],
                option_id: optionId,
            })
        );
    };

    const renderOption = (option, provided, index) => (
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <OptionItem
                parentQuestion={parentQuestion}
                option={option}
                index={index}
            />

            <IconButton
                onClick={() => handleDeleteOption(option[OPTION_ID])}
                size={'medium'}
                sx={{
                    ml: 2,
                    '&:hover': {
                        backgroundColor: 'rgba(255, 0, 0, 0.2)', // Изменение цвета при наведении
                    },
                }}
            >
                <Delete fontSize={'medium'} />
            </IconButton>
        </Box>
    );

    return (
        <div>
            <DragDropWrapper
                items={options.map((option) => ({
                    id: option[OPTION_ID],
                    ...option,
                }))}
                renderItem={renderOption}
                onDragEnd={handleOptionsDragEnd}
            />
            <Button
                variant="outlined"
                color="primary"
                startIcon={<Add />}
                onClick={handleOpenDialog}
                fullWidth
                sx={{ mt: 2 }}
            >
                Добавить опцию
            </Button>
            <OptionTypeDialog
                open={dialogOpen}
                handleClose={handleCloseDialog}
                onAddOption={handleAddOption}
            />
        </div>
    );
};

export default QuestionOptionsEditor;
