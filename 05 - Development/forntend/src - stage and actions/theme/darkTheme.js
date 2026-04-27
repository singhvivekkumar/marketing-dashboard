import { createTheme } from '@mui/material/styles'; 

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f8fafc', // Light grey-blue tint
      paper: '#ffffff',
    },
    primary: {
      main: '#2563eb', // Slightly more saturated for light mode
      light: '#60a5fa',
      dark: '#1e40af',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#7c3aed',
      light: '#a78bfa',
      dark: '#5b21b6',
    },
    success: {
      main: '#16a34a',
      light: '#f0fdf4',
      dark: '#14532d',
    },
    warning: {
      main: '#d97706',
      light: '#fffbeb',
      dark: '#78350f',
    },
    error: {
      main: '#dc2626',
      light: '#fef2f2',
      dark: '#7f1d1d',
    },
    info: {
      main: '#0891b2',
      light: '#ecfeff',
    },
    text: {
      primary: '#1e293b', // Deep slate
      secondary: '#64748b', // Muted slate
      disabled: '#94a3b8',
    },
    divider: '#e2e8f0', // Clean border color
    action: {
      hover: '#f1f5f9',
      selected: 'rgba(37, 99, 235, 0.08)',
    },
  },
  typography: {
    fontFamily: "'IBM Plex Sans', sans-serif",
    h1: { fontSize: '32px', fontWeight: 600, color: '#0f172a' },
    h2: { fontSize: '28px', fontWeight: 600, color: '#0f172a' },
    h3: { fontSize: '24px', fontWeight: 600, color: '#0f172a' },
    h4: { fontSize: '20px', fontWeight: 600, color: '#0f172a' },
    h5: { fontSize: '16px', fontWeight: 600, color: '#0f172a' },
    h6: { fontSize: '14px', fontWeight: 600, color: '#0f172a' },
    body1: { fontSize: '12.5px', fontWeight: 400 },
    body2: { fontSize: '11.5px', fontWeight: 400 },
    caption: { fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', fontFamily: "'IBM Plex Mono', monospace" },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  shape: {
    borderRadius: 6,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: '12px',
          fontWeight: 500,
          padding: '7px 14px',
          borderRadius: '6px',
          transition: 'all 0.15s',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
        contained: {
          backgroundColor: '#2563eb',
          color: '#fff',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: '#1d4ed8',
            boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
          },
        },
        outlined: {
          borderColor: '#cbd5e1',
          color: '#475569',
          '&:hover': {
            backgroundColor: '#f8fafc',
            borderColor: '#94a3b8',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          boxShadow: '0px 1px 3px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          fontSize: '12px',
          backgroundColor: '#ffffff',
          color: '#475569',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#e2e8f0',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#cbd5e1',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#2563eb',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#ffffff',
            color: '#1e293b',
            fontSize: '12.5px',
            '& fieldset': {
              borderColor: '#e2e8f0',
            },
            '&:hover fieldset': {
              borderColor: '#cbd5e1',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#2563eb',
            },
          },
          '& .MuiOutlinedInput-input::placeholder': {
            color: '#94a3b8',
            opacity: 1,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '3px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '10px',
          fontWeight: 600,
          height: 'auto',
          padding: '2px 8px',
        },
        colorPrimary: {
          backgroundColor: '#eff6ff',
          color: '#2563eb',
          border: '1px solid #dbeafe',
        },
        colorSuccess: {
          backgroundColor: '#f0fdf4',
          color: '#16a34a',
          border: '1px solid #dcfce7',
        },
        colorWarning: {
          backgroundColor: '#fffbeb',
          color: '#d97706',
          border: '1px solid #fef3c7',
        },
        colorError: {
          backgroundColor: '#fef2f2',
          color: '#dc2626',
          border: '1px solid #fee2e2',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: '11.5px',
          fontWeight: 500,
          color: '#64748b',
          padding: '10px 14px',
          minHeight: 'auto',
          '&:hover': {
            color: '#1e293b',
          },
          '&.Mui-selected': {
            color: '#2563eb',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #e2e8f0',
          minHeight: 'auto',
        },
        indicator: {
          backgroundColor: '#2563eb',
          height: '2px',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#f8fafc',
          '& .MuiTableCell-head': {
            borderBottom: '1px solid #e2e8f0',
            color: '#64748b',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            letterSpacing: '0.08em',
            fontWeight: 600,
            padding: '10px 12px',
          },
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          '& .MuiTableRow-root': {
            borderBottom: '1px solid #f1f5f9',
            '&:hover': {
              backgroundColor: '#f8fafc',
            },
          },
          '& .MuiTableCell-body': {
            color: '#475569',
            padding: '10px 12px',
          },
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0d0f14',
      paper: '#13161e',
    },
    primary: {
      main: '#4f9cf9',
      light: '#2563eb',
      dark: '#1e40af',
      contrastText: '#fff',
    },
    secondary: {
      main: '#a78bfa',
      light: '#c4b5fd',
      dark: '#7c3aed',
    },
    success: {
      main: '#22c55e',
      light: '#052012',
      dark: '#15532d',
    },
    warning: {
      main: '#f59e0b',
      light: '#1a1200',
      dark: '#713f0a',
    },
    error: {
      main: '#ef4444',
      light: '#1a0202',
      dark: '#5c1414',
    },
    info: {
      main: '#22d3ee',
      light: '#06b6d4',
    },
    text: {
      primary: '#d4daf0',
      secondary: '#8892b0',
      disabled: '#4a567a',
    },
    divider: '#2a3045',
    action: {
      hover: '#1a1e29',
      selected: 'rgba(79, 156, 249, 0.08)',
    },
  },
  typography: {
    fontFamily: "'IBM Plex Sans', sans-serif",
    h1: { fontSize: '32px', fontWeight: 600 },
    h2: { fontSize: '28px', fontWeight: 600 },
    h3: { fontSize: '24px', fontWeight: 600 },
    h4: { fontSize: '20px', fontWeight: 600 },
    h5: { fontSize: '16px', fontWeight: 600 },
    h6: { fontSize: '14px', fontWeight: 600 },
    body1: { fontSize: '12.5px', fontWeight: 400 },
    body2: { fontSize: '11.5px', fontWeight: 400 },
    caption: { fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', fontFamily: "'IBM Plex Mono', monospace" },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  shape: {
    borderRadius: 6,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: '12px',
          fontWeight: 500,
          padding: '7px 14px',
          borderRadius: '6px',
          transition: 'all 0.15s',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
          },
        },
        contained: {
          backgroundColor: '#2563eb',
          color: '#fff',
          border: '1px solid #4f9cf9',
          '&:hover': {
            backgroundColor: '#1d4ed8',
            borderColor: '#4f9cf9',
          },
        },
        outlined: {
          borderColor: '#3a4560',
          color: '#8892b0',
          '&:hover': {
            backgroundColor: '#1a1e29',
            borderColor: '#3a4560',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#13161e',
          border: '1px solid #2a3045',
          borderRadius: '10px',
          transition: 'all 0.15s',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          fontSize: '12px',
          backgroundColor: '#1a1e29',
          color: '#8892b0',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#2a3045',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#3a4560',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#4f9cf9',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#1a1e29',
            color: '#d4daf0',
            fontSize: '12.5px',
            '& fieldset': {
              borderColor: '#2a3045',
            },
            '&:hover fieldset': {
              borderColor: '#3a4560',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#4f9cf9',
            },
          },
          '& .MuiOutlinedInput-input::placeholder': {
            color: '#4a567a',
            opacity: 1,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '3px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '10px',
          fontWeight: 600,
          height: 'auto',
          padding: '2px 8px',
        },
        colorPrimary: {
          backgroundColor: 'rgba(79, 156, 249, 0.1)',
          color: '#4f9cf9',
          border: '1px solid rgba(79, 156, 249, 0.3)',
        },
        colorSuccess: {
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          color: '#22c55e',
          border: '1px solid rgba(34, 197, 94, 0.3)',
        },
        colorWarning: {
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          color: '#f59e0b',
          border: '1px solid rgba(245, 158, 11, 0.3)',
        },
        colorError: {
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          color: '#ef4444',
          border: '1px solid rgba(239, 68, 68, 0.3)',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: '11.5px',
          fontWeight: 500,
          color: '#4a567a',
          padding: '10px 14px',
          minHeight: 'auto',
          '&:hover': {
            color: '#8892b0',
          },
          '&.Mui-selected': {
            color: '#4f9cf9',
            borderBottom: '2px solid #4f9cf9',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #2a3045',
          minHeight: 'auto',
        },
        indicator: {
          display: 'none',
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          fontSize: '12.5px',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          '& .MuiTableCell-head': {
            backgroundColor: 'transparent',
            borderBottom: '1px solid #2a3045',
            color: '#4a567a',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            letterSpacing: '0.08em',
            fontWeight: 600,
            padding: '10px 12px',
          },
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          '& .MuiTableRow-root': {
            borderBottom: '1px solid #2a3045',
            '&:hover': {
              backgroundColor: '#1a1e29',
            },
          },
          '& .MuiTableCell-body': {
            color: '#8892b0',
            padding: '10px 12px',
          },
        },
      },
    },
  },
});



// export default darkTheme;
