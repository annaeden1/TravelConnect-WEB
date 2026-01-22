import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import AiChatPage from './pages/AiChatPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AiChatPage />
    </ThemeProvider>
  );
}

export default App;
