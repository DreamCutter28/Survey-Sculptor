import React from 'react';

import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import Layout from './components/Layout';
import MainRoutes from './components/MainRoutes';

const App = () => {
    return (
        <>
            <ThemeProvider theme={theme}>
                <Layout>
                    <MainRoutes />
                </Layout>
            </ThemeProvider>
        </>
    );
};

export default App;
