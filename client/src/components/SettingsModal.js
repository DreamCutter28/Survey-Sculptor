//components/SurveyLogicModal.js
import React from 'react';
import { Modal, Box, Typography } from '@mui/material';

const SettingsModal = ({ settingsParameters, open, onClose, title = "Настройка параметров" }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    width: '50%',
                    height: '90%',
                    // maxWidth: 600,
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    margin: 'auto',
                    bgcolor: 'background.paper',
                    p: 3,
                    mt: 10,
                    backgroundColor: 'rgba(225, 225, 225, 1.0)',
                }}
            >
                <Typography variant="h6" gutterBottom>
                    {title}
                </Typography>


                {/* Рендеринг переданных компонентов */}
                {settingsParameters.map((SettingComponent, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                        {SettingComponent}
                    </Box>
                ))}

                {/* <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography sx={{ width: '100%', flexShrink: 0 }}>
                            Настройка приоритета
                        </Typography>

                    </AccordionSummary>
                    <AccordionDetails>

                    </AccordionDetails>
                </Accordion> */}
            </Box>
        </Modal>
    );
};

export default SettingsModal;