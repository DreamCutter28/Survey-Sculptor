import React, { useState, useEffect } from 'react';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    IconButton,
    TextField,
    Modal,
    Box,
} from '@mui/material';
import { Add, Edit } from '@mui/icons-material';


const { QUESTION_ID, QUESTION_NAME } = require('../constants');

const MyQuestionBase = () => {
    const [questions, setQuestions] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const [editOpen, setEditOpen] = React.useState(false);
    const handleEditOpen = () => setEditOpen(true);
    const handleEditClose = () => setEditOpen(false);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_API_URL}/getQuestionList`
                );
                const data = await response.json();
                const formattedQuestions = data.map((question) => ({
                    id: question[QUESTION_ID],
                    name: question[QUESTION_NAME],
                }));
                setQuestions(formattedQuestions);
            } catch (error) {
                console.error('Failed to fetch questions:', error);
            }
        };

        fetchQuestions();
    }, []);

    const handleAddQuestion = () => {
        console.log('Добавить новый вопрос');
    };

    const handleEditQuestion = (questionId) => {
        console.log('Редактировать вопрос:', questionId);
    };

    const filteredQuestions = questions.filter((question) =>
        question?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                База вопросов
            </Typography>
            <TextField
                label="Поиск вопросов"
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Card
                        onClick={handleAddQuestion}
                        style={{
                            cursor: 'pointer',
                            textAlign: 'center',
                            height: '100%',
                        }}
                    >
                        <CardContent
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                            }}
                        >
                            <Add fontSize="large" color="primary" />
                            <Typography variant="h6" color="primary">
                                Добавить вопрос
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                {filteredQuestions.map((question) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={question.id}>
                        <Card style={{ height: '100%' }}>
                            <CardContent
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    height: '100%',
                                }}
                            >
                                <Typography variant="h6">
                                    {question.name.length > 50
                                        ? `${question.name.substring(0, 50)}...`
                                        : question.name}
                                </Typography>
                                <IconButton
                                    onClick={() =>
                                        handleEditQuestion(question.id)
                                    }
                                    size="small"
                                    style={{ alignSelf: 'flex-end' }}
                                >
                                    <Edit fontSize="small" />
                                </IconButton>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Modal open={editOpen} onclose={handleEditClose}>
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
                    <Typography>test</Typography>
                </Box>
            </Modal>
        </div>
    );
};

export default MyQuestionBase;
