import { createTheme } from '@mui/material/styles';

const iosTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#34c759',
      dark: '#239a3d',
      light: '#8ee7a6'
    },
    secondary: {
      main: '#1b8f4a'
    },
    background: {
      default: '#f4fbf6',
      paper: '#ffffff'
    },
    text: {
      primary: '#101b14',
      secondary: '#5f6e63'
    },
    divider: 'rgba(52, 199, 89, 0.15)',
    action: {
      hover: 'rgba(52, 199, 89, 0.08)',
      selected: 'rgba(52, 199, 89, 0.16)'
    }
  },
  shape: {
    borderRadius: 20
  },
  typography: {
    fontFamily: '"SF Pro Display", "Segoe UI", system-ui, -apple-system, sans-serif'
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: 'linear-gradient(180deg, #f6fbf8 0%, #eef6f1 100%)'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(52, 199, 89, 0.12)',
          boxShadow: '0 18px 50px rgba(15, 23, 42, 0.06)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 18,
          fontWeight: 600,
          boxShadow: 'none'
        },
        contained: {
          boxShadow: '0 12px 30px rgba(52, 199, 89, 0.2)'
        },
        outlined: {
          borderColor: 'rgba(52, 199, 89, 0.35)'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          border: '1px solid rgba(52, 199, 89, 0.12)',
          boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)'
        }
      }
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          borderRadius: 22,
          border: '1px solid rgba(52, 199, 89, 0.16)',
          backgroundColor: '#ffffff'
        },
        columnHeaders: {
          backgroundColor: '#f0faf3'
        }
      }
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          backgroundColor: '#eef7f1',
          borderRadius: 18,
          border: '1px solid rgba(52, 199, 89, 0.16)'
        }
      }
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          paddingInline: 18
        }
      }
    }
  }
});

export default iosTheme;
