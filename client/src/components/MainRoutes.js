import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SurveyList from './SurveyList';
import SurveyEditor from './SurveyEditor';
import SurveyForm from './CreateSurveyForm';
import NotFound from './NotFound';

/**
 * Компонент для управления маршрутами в приложении.
 * Определяет основные маршруты и связывает их с соответствующими компонентами.
 */
const MainRoutes = () => {
    return (
        <Routes>
            {/* Маршрут к списку всех опросов. */}
            <Route path="/" element={<SurveyList />} />

            {/* Маршрут для редактирования существующего или нового опроса. 
              Используется для редактирования опросов, данные которых передаются через state. */}
            <Route path="/survey/edit/:id" element={<SurveyEditor />} />

            {/* Маршрут для создания нового опроса. Использует компонент SurveyForm для ввода данных. */}
            <Route path="/survey/create" element={<SurveyForm />} />

            {/* Альтернативный маршрут для редактирования нового опроса, предназначенный для передачи начального состояния через state.
               Этот маршрут позволяет прямо передать данные для нового опроса в SurveyEditor. */}
            <Route path="/survey/edit/new" element={<SurveyEditor />} />

            {/* Маршрут для обработки 404 ошибок. */}
            <Route path="*" element={<NotFound />} />  /
        </Routes>
    );
};

export default MainRoutes;
