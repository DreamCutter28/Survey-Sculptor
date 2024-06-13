import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    RadioGroup,
    FormControlLabel,
    Radio,
    Button,
} from '@mui/material';

const OptionTypeDialog = ({ open, handleClose, onAddOption }) => {
    const [newOptionType, setNewOptionType] = useState('0');

    const handleAddOption = () => {
        onAddOption(newOptionType);
        handleClose(); // Закрыть диалог после добавления
    };

    return (
        <>
            {/* Диалоговое окно */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Выберите тип опции</DialogTitle>
                <DialogContent>
                    <RadioGroup
                        value={newOptionType}
                        onChange={(e) => setNewOptionType(e.target.value)}
                    >
                        <FormControlLabel
                            value={0}
                            control={<Radio />}
                            label="Текстовый ввод"
                        />
                        <FormControlLabel
                            value={1}
                            control={<Radio />}
                            label="Обычный вариант ответа"
                        />
                        <FormControlLabel
                            value={2}
                            control={<Radio />}
                            label="Имя-значение"
                        />
                    </RadioGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={handleAddOption} color="primary">
                        Добавить
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default OptionTypeDialog;
