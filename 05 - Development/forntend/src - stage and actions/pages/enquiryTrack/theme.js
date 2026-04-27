import { createTheme, alpha } from '@mui/material/styles'

const PRIMARY = '#1a56a0'   // deep navy-blue
const SECONDARY = '#0e7c61' // teal-green accent

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary:   { main: PRIMARY,   light: '#2e6fc4', dark: '#103a6e', contrastText: '#fff' },
    secondary: { main: SECONDARY, light: '#18a67e', dark: '#0a5444', contrastText: '#fff' },
    background: { default: '#f0f3f8', paper: '#ffffff' },
    divider: '#dde3ed',
    text: { primary: '#1a2236', secondary: '#5a6880', disabled: '#a0aabb' },
    success: { main: '#1b8a5a', light: '#d4f0e5', dark: '#0f5c3a' },
    warning: { main: '#c07000', light: '#fef3da', dark: '#7a4700' },
    error:   { main: '#c0392b', light: '#fde8e6', dark: '#8c1a12' },
    info:    { main: '#0e6ba8', light: '#dbeeff', dark: '#08447a' },
    grey: {
      50:  '#f8fafd', 100: '#f0f3f8', 200: '#dde3ed',
      300: '#c3ccd9', 400: '#97a3b5', 500: '#6b7a90',
      600: '#4a566e', 700: '#35404f', 800: '#1e2733', 900: '#111820',
    },
  },
  typography: {
    fontFamily: "'DM Sans', sans-serif",
    h4: { fontWeight: 700, letterSpacing: '-0.02em' },
    h5: { fontWeight: 700, letterSpacing: '-0.015em' },
    h6: { fontWeight: 600, letterSpacing: '-0.01em' },
    subtitle1: { fontWeight: 600, fontSize: '0.9rem' },
    subtitle2: { fontWeight: 600, fontSize: '0.8rem', color: '#5a6880' },
    body1: { fontSize: '0.875rem' },
    body2: { fontSize: '0.8rem', color: '#5a6880' },
    caption: { fontSize: '0.72rem', letterSpacing: '0.04em', fontWeight: 500 },
    overline: { fontSize: '0.65rem', letterSpacing: '0.1em', fontWeight: 700 },
  },
  shape: { borderRadius: 8 },
  shadows: [
    'none',
    '0 1px 3px rgba(26,34,54,0.06), 0 1px 2px rgba(26,34,54,0.04)',
    '0 2px 6px rgba(26,34,54,0.08), 0 1px 3px rgba(26,34,54,0.05)',
    '0 4px 12px rgba(26,34,54,0.1), 0 2px 4px rgba(26,34,54,0.06)',
    '0 6px 20px rgba(26,34,54,0.12)',
    '0 8px 28px rgba(26,34,54,0.14)',
    ...Array(19).fill('none'),
  ],
  components: {
    MuiCssBaseline: { styleOverrides: { body: { backgroundColor: '#f0f3f8' } } },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", borderRadius: 7, fontSize: '0.825rem', letterSpacing: '0.01em' },
        sizeSmall: { fontSize: '0.75rem', padding: '4px 12px' },
        contained: { boxShadow: '0 1px 3px rgba(26,34,54,0.18)', '&:hover': { boxShadow: '0 3px 8px rgba(26,34,54,0.2)' } },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem', fontWeight: 600, height: 22, borderRadius: 4, letterSpacing: '0.02em' },
        label: { paddingLeft: 8, paddingRight: 8 },
      },
    },
    MuiCard: {
      styleOverrides: { root: { boxShadow: '0 1px 4px rgba(26,34,54,0.07)', borderRadius: 10, border: '1px solid #dde3ed' } },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: '#f0f3f8',
            color: '#5a6880',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.68rem',
            fontWeight: 600,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            borderBottom: '2px solid #dde3ed',
            padding: '10px 16px',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        body: { fontSize: '0.825rem', padding: '10px 16px', borderColor: '#eaeff6' },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': { backgroundColor: '#f4f7fc', cursor: 'pointer' },
          '&:last-child td': { borderBottom: 0 },
        },
      },
    },
    MuiTextField: {
      defaultProps: { size: 'small', variant: 'outlined' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            fontSize: '0.85rem',
            fontFamily: "'DM Sans', sans-serif",
            backgroundColor: '#fff',
            '& fieldset': { borderColor: '#c3ccd9' },
            '&:hover fieldset': { borderColor: '#8fa0bb' },
            '&.Mui-focused fieldset': { borderColor: PRIMARY },
          },
          '& .MuiInputLabel-root': { fontSize: '0.82rem' },
        },
      },
    },
    MuiSelect: {
      defaultProps: { size: 'small' },
      styleOverrides: {
        select: { fontSize: '0.85rem', fontFamily: "'DM Sans', sans-serif" },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none', fontWeight: 500, fontSize: '0.82rem',
          fontFamily: "'DM Sans', sans-serif", minHeight: 44, letterSpacing: 0,
          '&.Mui-selected': { fontWeight: 700 },
        },
      },
    },
    MuiTabs: {
      styleOverrides: { indicator: { height: 3, borderRadius: '3px 3px 0 0' } },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 7, margin: '1px 8px',
          '&.Mui-selected': {
            backgroundColor: alpha(PRIMARY, 0.1),
            color: PRIMARY,
            '& .MuiListItemIcon-root': { color: PRIMARY },
            '&:hover': { backgroundColor: alpha(PRIMARY, 0.14) },
          },
        },
      },
    },
    MuiDivider: { styleOverrides: { root: { borderColor: '#dde3ed' } } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiAlert: { styleOverrides: { root: { fontSize: '0.82rem', fontFamily: "'DM Sans', sans-serif", borderRadius: 8 } } },
    MuiStepLabel: {
      styleOverrides: {
        label: { fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', fontWeight: 500 },
      },
    },
  },
})
