import React from 'react';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
} from '@mui/material';

/**
 * Стилизованный компонент `Main`, использующий HTML тег `main`.
 * Применяет тематические отступы и высоту для создания единообразного лейаута.
 * @param {Object} theme - Тема MUI, используется для стилей.
 */
const Main = styled('main')(({ theme }) => ({
    flexGrow: 1, // Растягивает `main` на всю доступную ширину
    padding: theme.spacing(3), // Устанавливает внутренний отступ в 3 шага темы
    marginTop: theme.mixins.toolbar.minHeight, // Отступ сверху равный высоте тулбара для предотвращения наложения
}));

/**
 * Компонент `Layout`, который используется для оборачивания и стилизации страниц.
 * Он включает в себя верхнюю навигационную панель и область для содержимого страниц.
 * @param {Object} props - Свойства компонента.
 * @param {React.ReactNode} props.children - Элементы React, которые будут отображаться в основной области.
 */
const Layout = ({ children }) => {
    return (
        <Box sx={{ display: 'flex' }}> {/* Устанавливает гибкий контейнер для всего макета */}
            <AppBar position="fixed"> {/* Фиксированная верхняя панель */}
                <Toolbar> {/* Панель инструментов для размещения контента в шапке */}
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }} // Заставляет заголовок занимать максимально возможное пространство
                    >
                        Опросник
                    </Typography>
                    <Button component={Link} to="/" color="inherit">
                        Мои анкеты
                    </Button>
                    <Button component={Link} to="/survey/create" color="inherit">
                        Новый опрос
                    </Button>
                </Toolbar>
            </AppBar>
            <Main> {/* Основная область контента, располагается ниже AppBar */}
                {children}
            </Main>
        </Box>
    );
};

export default Layout;
