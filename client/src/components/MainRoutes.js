import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SurveyList from './SurveyList';
import SurveyEditor from './SurveyEditor';
import SurveyForm from './CreateSurveyForm';
import MyQuestionBase from './MyQuestionBase';
import NotFound from './NotFound';

/**
 * Компонент для управления маршрутами в приложении.
 * Определяет основные маршруты и связывает их с соответствующими компонентами.
 */
const MainRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<SurveyList />} />
            <Route
                path="/survey/edit/:interview_id"
                element={<SurveyEditor />}
            />
            <Route path="/survey/create" element={<SurveyForm />} />
            <Route path="/question-base" element={<MyQuestionBase />} />
            <Route path="/survey/edit/new" element={<SurveyEditor />} />
            <Route path="*" element={<NotFound />} /> /
        </Routes>
    );
};

export default MainRoutes;
