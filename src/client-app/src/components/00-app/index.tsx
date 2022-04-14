import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';

import Main from 'components/01-main';
import Sidebar from 'components/02-sidebar';
import Header from 'components/03-header';

import { theme } from './theme';

function App() {
  return (
    <div style={{ display: 'flex' }}>
      <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <Header />
          <Sidebar />
          <Main />
        </Box>
      </ThemeProvider>
    </div>
  );
}

export default App;
