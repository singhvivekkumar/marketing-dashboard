// src/theme/index.js
// Matches the original dashboard: DM Sans font, blue/teal/amber/red/green palette
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary:   { main: '#2563eb', light: '#eff4ff', dark: '#1d4ed8', contrastText: '#fff' },
    secondary: { main: '#7c3aed', light: '#f5f3ff', dark: '#6d28d9', contrastText: '#fff' },
    success:   { main: '#16a34a', light: '#f0fdf4', dark: '#15803d' },
    warning:   { main: '#d97706', light: '#fffbeb', dark: '#b45309' },
    error:     { main: '#dc2626', light: '#fef2f2', dark: '#b91c1c' },
    info:      { main: '#0d9488', light: '#f0fdfa', dark: '#0f766e' },
    background: { default: '#f7f8fa', paper: '#ffffff' },
    text: {
      primary:   '#0f1117',
      secondary: '#525868',
      disabled:  '#8892a4',
    },
    divider: '#e4e8ef',
    grey: {
      50:  '#f7f8fa',
      100: '#f1f3f7',
      200: '#e4e8ef',
      300: '#d0d5e0',
      400: '#8892a4',
      500: '#525868',
      900: '#0f1117',
    },
  },

  typography: {
    fontFamily: '"DM Sans", "Inter", system-ui, sans-serif',
    fontSize: 13,
    fontWeightLight:   300,
    fontWeightRegular: 400,
    fontWeightMedium:  500,
    fontWeightBold:    600,
    h1: { fontSize: '1.5rem',  fontWeight: 600, letterSpacing: '-0.3px' },
    h2: { fontSize: '1.25rem', fontWeight: 600 },
    h3: { fontSize: '1.1rem',  fontWeight: 500 },
    h4: { fontSize: '1rem',    fontWeight: 500 },
    h5: { fontSize: '0.9rem',  fontWeight: 500 },
    h6: { fontSize: '0.85rem', fontWeight: 500 },
    subtitle1: { fontSize: '0.8rem',  color: '#8892a4' },
    subtitle2: { fontSize: '0.75rem', color: '#8892a4' },
    body1: { fontSize: '0.875rem' },
    body2: { fontSize: '0.8125rem' },
    caption: { fontSize: '0.6875rem' },
    overline: { fontSize: '0.625rem', letterSpacing: '0.06em', fontWeight: 500 },
  },

  shape: { borderRadius: 10 },

  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.06)',
    '0 2px 6px rgba(0,0,0,0.08)',
    '0 4px 12px rgba(0,0,0,0.1)',
    ...Array(21).fill('none'),
  ],

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f7f8fa',
          fontFamily: '"DM Sans", system-ui, sans-serif',
        },
        '*': { boxSizing: 'border-box' },
        '::-webkit-scrollbar': { width: 6, height: 6 },
        '::-webkit-scrollbar-track': { background: '#f1f3f7' },
        '::-webkit-scrollbar-thumb': { background: '#d0d5e0', borderRadius: 3 },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.8125rem',
          borderRadius: 8,
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
        contained: { boxShadow: 'none', '&:hover': { boxShadow: 'none' } },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          border: '1px solid #e4e8ef',
          borderRadius: 14,
        },
      },
    },

    MuiCardContent: {
      styleOverrides: { root: { padding: '18px 20px', '&:last-child': { paddingBottom: 18 } } },
    },

    MuiPaper: {
      styleOverrides: {
        root: { boxShadow: 'none', border: '1px solid #e4e8ef' },
        elevation0: { border: 'none' },
      },
    },

    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: '#f1f3f7',
            color: '#8892a4',
            fontSize: '0.6875rem',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            padding: '9px 14px',
            borderBottom: '1px solid #e4e8ef',
          },
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '9px 14px',
          fontSize: '0.8125rem',
          color: '#525868',
          borderBottom: '1px solid #e4e8ef',
        },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:last-child td': { borderBottom: 'none' },
          '&:hover td': { backgroundColor: '#f7f8fa' },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: '0.6875rem',
          fontWeight: 500,
          height: 22,
          borderRadius: 5,
        },
      },
    },

    MuiTextField: {
      defaultProps: { size: 'small', variant: 'outlined' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            fontSize: '0.875rem',
            borderRadius: 8,
            backgroundColor: '#fff',
            '& fieldset': { borderColor: '#e4e8ef' },
            '&:hover fieldset': { borderColor: '#d0d5e0' },
            '&.Mui-focused fieldset': { borderColor: '#2563eb' },
          },
        },
      },
    },

    MuiSelect: {
      defaultProps: { size: 'small' },
      styleOverrides: {
        root: { fontSize: '0.8125rem', borderRadius: 8 },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: '0.8125rem',
          fontWeight: 400,
          minHeight: 40,
          padding: '5px 14px',
          color: '#525868',
          '&.Mui-selected': { fontWeight: 500, color: '#2563eb' },
        },
      },
    },

    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 40,
          backgroundColor: '#f1f3f7',
          borderRadius: 8,
          padding: 3,
        },
        indicator: {
          height: '100%',
          borderRadius: 6,
          backgroundColor: '#ffffff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          zIndex: 0,
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: { fontSize: '0.875rem' },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: { border: 'none', borderRight: '1px solid #e4e8ef' },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '1px 8px',
          width: 'calc(100% - 16px)',
          padding: '7px 12px',
          fontSize: '0.8125rem',
          '&.Mui-selected': {
            backgroundColor: '#eff4ff',
            color: '#2563eb',
            '&:hover': { backgroundColor: '#eff4ff' },
          },
          '&:hover': { backgroundColor: '#f1f3f7' },
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#0f1117',
          boxShadow: 'none',
          borderBottom: '1px solid #e4e8ef',
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 14, border: '1px solid #e4e8ef', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' },
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: { fontSize: '1rem', fontWeight: 600, padding: '16px 20px' },
      },
    },
  },
});

export default theme;
