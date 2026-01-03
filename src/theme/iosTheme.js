import { createTheme } from '@mui/material/styles';

const iosTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0a84ff'
    },
    background: {
      default: '#f2f4f8',
      paper: '#ffffff'
    }
  },
  shape: {
    borderRadius: 18
  },
  typography: {
    fontFamily: '"SF Pro Display", "Segoe UI", system-ui, -apple-system, sans-serif'
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 14px 40px rgba(16, 24, 40, 0.08)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 16
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 22,
          border: '1px solid rgba(226, 232, 240, 0.9)',
          boxShadow: '0 16px 36px rgba(15, 23, 42, 0.08)'
        }
      }
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: '1px solid rgba(226, 232, 240, 0.9)',
          backgroundColor: '#ffffff'
        },
        columnHeaders: {
          backgroundColor: '#f7f8fd'
        }
      }
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          backgroundColor: '#f0f2f8',
          borderRadius: 16
        }
      }
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          paddingInline: 18
        }
      }
    }
  }
});

export default iosTheme;
