import { createTheme } from '@mui/material/styles';

const iosTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1c7efb'
    },
    background: {
      default: '#f5f6fb',
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
    MuiCssBaseline: {
      styleOverrides: {
        '@media print': {
          body: {
            background: '#ffffff'
          },
          'body *': {
            visibility: 'hidden'
          },
          '.print-area, .print-area *': {
            visibility: 'visible'
          },
          '.print-area': {
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: 'auto',
            boxShadow: 'none'
          },
          '.print-area .MuiDataGrid-root': {
            height: 'auto'
          },
          '.print-area .MuiDataGrid-virtualScroller': {
            overflow: 'visible'
          },
          '.print-area .MuiDataGrid-virtualScrollerContent': {
            height: 'auto'
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 12px 28px rgba(16, 24, 40, 0.08)'
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
          borderRadius: 20
        }
      }
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          backgroundColor: '#f1f2f8',
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
