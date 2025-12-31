// External libraries
import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Cookies from 'js-cookie';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

// Lazy-loaded Components
const ResetPassword = lazy(() => import('../components/organisms/reset-password'));
const NewPassword = lazy(() => import('../components/organisms/new-password'));
const Register = lazy(() => import('../components/organisms/register'));
const Validate = lazy(() => import('../components/organisms/validate'));
const Uploader = lazy(() => import('../components/organisms/uploader'));
const Files = lazy(() => import('../components/organisms/files'));
const Login = lazy(() => import('../components/organisms/login'));
const Auth = lazy(() => import('../components/pages/auth'));
const Home = lazy(() => import('../components/pages/home'));
const RangeBuilder = lazy(() => import('../components/organisms/range-builder'));
const Account = lazy(() => import('../components/organisms/account'));
const ScenarioList = lazy(() => import('../components/organisms/scenario-list'));
const ScenarioDetail = lazy(() => import('../components/organisms/scenario-detail'));

// Routes
import { AuthProtected } from './auth-protected';

// Loading fallback component
const LoadingFallback = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}
  >
    <CircularProgress />
  </Box>
);

// Props passed down to auth protected route
const refreshCookie = Cookies.get('RefreshExist');

export const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
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
            <Route path="" element={<Navigate to="range" />} />
            <Route path="upload" element={<Uploader />} />
            <Route path="dashboard" element={<Files />} />
            <Route path="range" element={<RangeBuilder />} />
            <Route path="account" element={<Account />} />
            <Route path="scenarios" element={<ScenarioList />} />
            <Route path="scenarios/:id" element={<ScenarioDetail />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};
