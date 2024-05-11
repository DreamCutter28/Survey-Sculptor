import React, { useState, useCallback } from 'react';
import {
    Drawer,
    Toolbar,
    Box,
    Button,
} from '@mui/material';
import { useMediaQuery, useTheme } from '@mui/material';
import SurveyNavigator from './SurveyNavigator';
import SurveyPageEditor from './SurveyPageEditor';
import LoadingIndicator from './LoadingIndicator';
import SurveyLogicModal from './SurveyLogicModal';
import { useLocation } from 'react-router-dom';

/**
 * Генерирует уникальный идентификатор для опции вопроса.
 * @param {string} pageId - ID страницы.
 * @param {number} index - Порядковый номер опции.
 * @returns {string} Уникальный ID опции.
 */
const generateOptionId = (pageId, index) => `opt_${pageId}_${index}`;

/**
 * Редактор опросов, который позволяет создавать и редактировать страницы опроса.
 * Инициализирует состояние опроса из данных, переданных через состояние маршрута (location.state).
 */
const SurveyEditor = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const location = useLocation();

    const [survey, setSurvey] = useState(location.state || { pages: [] });
    const [selectedPage, setSelectedPage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLogicModalOpen, setIsLogicModalOpen] = useState(false);

    // Открытие модального окна для логики страницы.
    const handleOpenLogicModal = () => setIsLogicModalOpen(true);
    // Закрытие модального окна логики.
    const handleCloseLogicModal = () => setIsLogicModalOpen(false);

    // Сохранение логики для текущей страницы.
    const handleSaveLogic = (currentPageId, conditions) => {
        const updatedPages = survey.pages.map((page) =>
            page.id === currentPageId ? { ...page, logic: conditions } : page
        );
        setSurvey((prev) => ({ ...prev, pages: updatedPages }));
    };

    // Добавление новой страницы в опрос.
    const handleAddPage = useCallback(() => {
        const newPageId = (survey.pages.length + 1).toString();
        const newPage = { id: newPageId, type: 'text', question: '', options: [] };
        setSurvey((prev) => ({ ...prev, pages: [...prev.pages, newPage] }));
        setSelectedPage(newPageId);
    }, [survey]);

    // Обработка клика по странице.
    const handlePageClick = useCallback((pageId) => setSelectedPage(pageId), []);

    // Перетаскивание и изменение порядка страниц.
    const handleDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;

        const reorderedPages = Array.from(survey.pages);
        const [movedPage] = reorderedPages.splice(source.index, 1);
        reorderedPages.splice(destination.index, 0, movedPage);

        setSurvey((prev) => ({ ...prev, pages: reorderedPages }));
    };

    // Обработка перетаскивания опций ответов.
    const handleOptionsDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;

        const updatedPages = survey.pages.map((page) => {
            if (page.id === selectedPage) {
                const newOptions = Array.from(page.options);
                const [movedOption] = newOptions.splice(source.index, 1);
                newOptions.splice(destination.index, 0, movedOption);
                return { ...page, options: newOptions };
            }
            return page;
        });

        setSurvey((prev) => ({ ...prev, pages: updatedPages }));
    };

    // Изменение типа страницы.
    const handlePageTypeChange = (e) => {
        const updatedPages = survey.pages.map((page) =>
            page.id === selectedPage ? { ...page, type: e.target.value, options: [] } : page
        );
        setSurvey((prev) => ({ ...prev, pages: updatedPages }));
    };

    // Изменение вопроса страницы.
    const handleQuestionChange = (e) => {
        const updatedPages = survey.pages.map((page) =>
            page.id === selectedPage ? { ...page, question: e.target.value } : page
        );
        setSurvey((prev) => ({ ...prev, pages: updatedPages }));
    };

    // Добавление новой опции ответа.
    const handleAddOption = () => {
        const currentPage = survey.pages.find((page) => page.id === selectedPage);
        const newOptionId = generateOptionId(selectedPage, currentPage.options.length + 1);
        const newOption = { id: newOptionId, value: '' };

        const updatedPages = survey.pages.map((page) =>
            page.id === selectedPage ? { ...page, options: [...page.options, newOption] } : page
        );
        setSurvey((prev) => ({ ...prev, pages: updatedPages }));
    };

    // Изменение значения опции ответа.
    const handleOptionChange = (optionId, e) => {
        const updatedPages = survey.pages.map((page) => {
            if (page.id === selectedPage) {
                const updatedOptions = page.options.map((option) =>
                    option.id === optionId ? { ...option, value: e.target.value } : option
                );
                return { ...page, options: updatedOptions };
            }
            return page;
        });
        setSurvey((prev) => ({ ...prev, pages: updatedPages }));
    };

    // Удаление опции ответа.
    const handleDeleteOption = (optionId) => {
        const updatedPages = survey.pages.map((page) => {
            if (page.id === selectedPage) {
                const updatedOptions = page.options.filter((option) => option.id !== optionId);
                return { ...page, options: updatedOptions };
            }
            return page;
        });
        setSurvey((prev) => ({ ...prev, pages: updatedPages }));
    };

    // Удаление страницы из опроса.
    const handleDeletePage = () => {
        const updatedPages = survey.pages.filter((page) => page.id !== selectedPage);
        setSurvey((prev) => ({ ...prev, pages: updatedPages }));
        setSelectedPage(updatedPages.length ? updatedPages[0].id : null);
    };

    // Отправка измененных данных опроса на сервер.
    const handleSubmit = () => {
        setIsLoading(true);

        const surveyData = {
            name: survey.name,
            description: survey.description,
            pages: survey.pages,
        };

        fetch('http://localhost:5000/api/surveys', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(surveyData),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Опрос успешно сохранен:', data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Ошибка сохранения опроса:', error);
                setIsLoading(false);
            });
    };

    // const handleSubmit = () => {
    //     setIsLoading(true);

    //     const surveyData = {
    //         name: survey.name,
    //         description: survey.description,
    //         pages: survey.pages,
    //     };

    //     // В тестовом режиме просто выводим данные в консоль
    //     console.log('Данные опроса:', JSON.stringify(surveyData, null, 2));
    //     setIsLoading(false);
    // };


    const selectedPageData = survey?.pages?.find((page) => page.id === selectedPage);

    // Отображение компонентов интерфейса.
    return (
        <Box sx={{ display: 'flex' }}>
            <>
                {/* Навигация и управление страницами опроса */}
                <Drawer
                    variant="permanent"
                    anchor="left"
                    open
                    sx={{
                        width: 240,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: 240,
                            boxSizing: 'border-box',
                        },
                    }}
                >
                    <Toolbar />
                    <SurveyNavigator
                        survey={survey}
                        onPageClick={handlePageClick}
                        onAddPage={handleAddPage}
                        onDragEnd={handleDragEnd}
                    />
                </Drawer>
                {/* Основное пространство для редактирования элементов опроса */}
                <Box sx={{ flex: 1, p: 3 }}>
                    {isLoading ? (
                        <LoadingIndicator text="Сохранение опроса..." />
                    ) : (
                        <>
                            <SurveyPageEditor
                                selectedPageData={selectedPageData}
                                selectedPageIndex={survey.pages.findIndex((page) => page.id === selectedPage) + 1}
                                isMobile={isMobile}
                                onChangeQuestion={handleQuestionChange}
                                onDeletePage={handleDeletePage}
                                onChangePageType={handlePageTypeChange}
                                onChangeOption={handleOptionChange}
                                onDeleteOption={handleDeleteOption}
                                onAddOption={handleAddOption}
                                onOptionsDragEnd={handleOptionsDragEnd}
                                onOpenLogicModal={handleOpenLogicModal}
                            />
                            <SurveyLogicModal
                                open={isLogicModalOpen}
                                onClose={handleCloseLogicModal}
                                onSaveLogic={handleSaveLogic}
                                pages={survey.pages}
                                currentPageId={selectedPage}
                                logic={selectedPageData?.logic || []}
                            />
                            {/* Фиксированная кнопка для сохранения изменений */}
                            <Box sx={{ position: 'fixed', bottom: 16, right: 16 }}>
                                <Button variant="contained" color="primary" onClick={handleSubmit}>
                                    Сохранить опрос
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>
            </>
        </Box>
    );
};

export default SurveyEditor;
