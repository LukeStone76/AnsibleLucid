import { createTheme } from '@mui/material/styles';

const theme = createTheme({

  // Main Elements
  palette: {
    primary: {
      main: '#1976d2',
      light: '#63a4ff',
      dark: '#004ba0',
      contrastText: '#fff',
    },
    secondary: {
      main: '#d32f8f',
      light: '#ff5cab',
      dark: '#9a0036',
      contrastText: '#fff',
    },
    background: {
      default: '#f0f0f0',
      paper: '#ffffff',
    },
    text: {
      primary: '#333',
      secondary: '#666', 
    }
  },
  typography: {
    fontFamily: 'Roboto, Arial',
  },

  components: {

    // Buttons
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },

    // Tables
    MuiTable: {
      styleOverrides: {
        root: {
          borderCollapse: 'collapse',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '8px',
          border: '1px solid #ddd',
        },
        head: {
          backgroundColor: '#f5f5f5',
          fontWeight: 'bold',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(even)': {
            backgroundColor: '#f9f9f9',
          },
        },
      },
    },

    // Text Fields
    MuiTextField: {
        styleOverrides: {
          root: {
            margin: '8px 0',
            borderRadius: '8px',
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            padding: '6px 12px',
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: '#000000',
            fontWeight: 'bold',
          },
        },
      },

    // Lists
    MuiList: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderRadius: '4px',
          border: '1px solid #ddd',
          padding: '8px',
          margin: '8px 0',
        },
        padding: {
          padding: '0',
        },
      },
    },

    },
});

export default theme;
