import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    buy: Palette['primary'];
    sell: Palette['primary'];
  }

  // allow configuration using `createTheme`
  interface PaletteOptions {
    buy?: PaletteOptions['primary'];
    sell?: PaletteOptions['primary'];
  }
}

// Update the Button's color prop options
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    buy: true;
    sell: true;
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      light: '#4791db',
      main: '#1976d2',
      dark: '#115293',
    },
    buy: {
      light: '#3ed59a',
      main: '#0ecb81',
      dark: '#098e5a',
      contrastText: '#fff',
    },
    sell: {
      light: '#f76b7d',
      main: '#f6465d',
      dark: '#ac3141',
      contrastText: '#fff',
    },
  },
});
