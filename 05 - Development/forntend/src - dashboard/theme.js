import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    background: {
      default: '#f7f8fa',
      paper: '#ffffff',
    },
    primary: {
      main: '#2563eb',
      light: '#dbeafe',
      dark: '#1e3a8a',
    },
    success: {
      main: '#16a34a',
      light: '#f0fdf4',
    },
    error: {
      main: '#dc2626',
      light: '#fef2f2',
    },
    warning: {
      main: '#d97706',
      light: '#fffbeb',
    },
    info: {
      main: '#0d9488',
      light: '#f0fdfa',
    },
    secondary: {
      main: '#7c3aed',
      light: '#f5f3ff',
    },
    text: {
      primary: '#0f1117',
      secondary: '#525868',
      disabled: '#8892a4',
    },
    divider: '#e4e8ef',
  },
  typography: {
    fontFamily: '"DM Sans", sans-serif',
    h1: { fontSize: '32px', fontWeight: 600, letterSpacing: '-0.5px' },
    h2: { fontSize: '28px', fontWeight: 600 },
    h3: { fontSize: '24px', fontWeight: 600 },
    h4: { fontSize: '20px', fontWeight: 600 },
    h5: { fontSize: '16px', fontWeight: 500 },
    h6: { fontSize: '13px', fontWeight: 500 },
    body1: { fontSize: '14px', fontWeight: 400 },
    body2: { fontSize: '13px', fontWeight: 400 },
    caption: { fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: '13px',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #e4e8ef',
          borderRadius: '14px',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          fontSize: '13px',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#e4e8ef',
          },
        },
      },
    },
  },
});
