import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        //mode: 'dark', // Устанавливаем режим темной темы
    },
    zIndex: {
        appBar: 1251,
        modal: 1250,
    },
});

export default theme;
// CreatableSelect из react-select использует свои собственные стили, которые автоматически не интегрируются с темами MUI. пока не ставлю темную
