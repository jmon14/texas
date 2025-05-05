// External libraries
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import Cookies from 'js-cookie';

// Components
import ResetPassword from './components/organisms/reset-password';
import NewPassword from './components/organisms/new-password';
import Register from './components/organisms/register';
import Validate from './components/organisms/validate';
import Uploader from './components/organisms/uploader';
import Loading from './components/molecules/loading';
import Files from './components/organisms/files';
import Login from './components/organisms/login';
import Auth from './components/pages/auth';
import Home from './components/pages/home';

// Routes
import { AuthProtected } from './routes/auth-protected';

// Store
import { useAppSelector } from './hooks/store-hooks';

// Utils
import { darkTheme, lightTheme } from './theme/theme';
import RangeBuilder from './components/organisms/range-builder';

// Props passed down to auth protected route
const refreshCookie = Cookies.get('RefreshExist');

const App = () => {
  const { mode } = useAppSelector((state) => state.theme);

  return (
    <ThemeProvider theme={mode === 'dark' ? darkTheme : lightTheme}>
      <CssBaseline />
      <Loading />
      <BrowserRouter>
        <Routes>
          <Route path="auth" element={<Auth />}>
            <Route
              element={
                <AuthProtected
                  refreshCookie={refreshCookie}
                  shouldBeLogged={false}
                  redirectPath="/"
                />
              }
            >
              <Route path="new-password" element={<NewPassword />} />
              <Route path="reset" element={<ResetPassword />} />
              <Route path="register" element={<Register />} />
              <Route path="login" element={<Login />} />
            </Route>
            <Route path="validate" element={<Validate />} />
          </Route>
          <Route
            element={
              <AuthProtected
                refreshCookie={refreshCookie}
                shouldBeLogged={true}
                redirectPath="auth/login"
              />
            }
          >
            <Route path="" element={<Home />}>
              <Route path="upload" element={<Uploader />} />
              <Route path="dashboard" element={<Files />} />
              <Route path="range" element={<RangeBuilder />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
