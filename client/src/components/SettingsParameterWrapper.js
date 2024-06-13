import React from 'react';
import { ExpandMore } from '@mui/icons-material';
import {
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';

const SettingsParameterWrapper = ({
    parameterHeader = 'Параметр настроек',
    parametersDetailComponents,
}) => {
    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography sx={{ width: '100%', flexShrink: 0 }}>
                    {parameterHeader}
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                {parametersDetailComponents.map(
                    (ParameterDetailComponent, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                            {ParameterDetailComponent}
                        </Box>
                    )
                )}
            </AccordionDetails>
        </Accordion>
    );
};

export default SettingsParameterWrapper;
