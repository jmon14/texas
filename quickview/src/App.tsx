// External libraries
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';

// Components
import Loading from './components/molecules/loading';

// Routes
import { AppRoutes } from './routes/app-routes';

// Store
import { useAppSelector } from './hooks/store-hooks';

// Utils
import { darkTheme, lightTheme } from './theme/theme';

const App = () => {
  const { mode } = useAppSelector((state) => state.theme);

  return (
    <ThemeProvider theme={mode === 'dark' ? darkTheme : lightTheme}>
      <CssBaseline />
      <Loading />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
