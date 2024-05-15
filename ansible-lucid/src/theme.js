import { createTheme } from '@mui/material/styles';

const theme = createTheme({




  // Main Elements
  palette: {
    primary: {
      main: '#1976d2', // Customize the primary color
      light: '#63a4ff', // Optional: Lighter shade for hover effects or lighter UI elements
      dark: '#004ba0',  // Optional: Darker shade for active states or darker UI elements
      contrastText: '#fff', // Text color that contrasts well with the primary color
    },
    secondary: {
      main: '#d32f8f', // Customize the secondary color
      light: '#ff5cab', // Optional: Lighter shade
      dark: '#9a0036',  // Optional: Darker shade
      contrastText: '#fff', // Text color for secondary palette
    },
    background: {
      default: '#f0f0f0', // Default background color
      paper: '#ffffff',   // Background color for paper-like elements (e.g., Cards)
    },
    text: {
      primary: '#333', // Text color used for primary content
      secondary: '#666', // Text color used for secondary content
    }
  },
  typography: {
    fontFamily: 'Roboto, Arial', // Customize the default font family
  },




  components: {

    // Buttons
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Customize button corner radius
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
          padding: '8px', // Customize padding
          border: '1px solid #ddd', // Add border to cells
        },
        head: {
          backgroundColor: '#f5f5f5', // Background color for header cells
          fontWeight: 'bold', // Make header text bold
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(even)': {
            backgroundColor: '#f9f9f9', // Alternate row color
          },
        },
      },
    },



    // Text Fields
    MuiTextField: {
        styleOverrides: {
          root: {
            margin: '8px 0', // Add margin to text fields
            borderRadius: '8px', // Round the corners
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            backgroundColor: '#f5f5f5', // Background color for text fields
            borderRadius: '4px', // Round the corners of the input
            padding: '6px 12px', // Add padding to the input
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: '#000000', // Customize the label color
            fontWeight: 'bold', // Make label bold
          },
        },
      },

    // Lists
    MuiList: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff', // Custom background color for lists
          borderRadius: '4px', // Rounded corners for the list container
          border: '1px solid #ddd', // Border around the list
          padding: '8px', // Padding around the list
          margin: '8px 0', // Margin around the list
        },
        padding: {
          padding: '0', // Remove default padding from list items if needed
        },
      },
    },



    },
});

export default theme;
