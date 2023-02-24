import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';

import Main from 'components/base/main';
import Sidebar from 'components/base/sidebar';
import Header from 'components/base/header';

import { theme } from './theme';

function App() {
  console.log('app');
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <BrowserRouter>
          <CssBaseline />
          <Header />
          <Sidebar />
          <Main />
        </BrowserRouter>
      </Box>
    </ThemeProvider>
  );
}

export default App;
