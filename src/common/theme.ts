import { createTheme } from '@mui/material';

const defaultTheme = createTheme({
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  palette: {
    mode: undefined,
    primary: {
      main: '#F50057',
    },
  },
});

export default defaultTheme;
