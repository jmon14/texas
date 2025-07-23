// External libraries
import { Navigate, Route, Routes } from 'react-router-dom';
import Cookies from 'js-cookie';

// Components
import ResetPassword from '../components/organisms/reset-password';
import NewPassword from '../components/organisms/new-password';
import Register from '../components/organisms/register';
import Validate from '../components/organisms/validate';
import Uploader from '../components/organisms/uploader';
import Files from '../components/organisms/files';
import Login from '../components/organisms/login';
import Auth from '../components/pages/auth';
import Home from '../components/pages/home';
import RangeBuilder from '../components/organisms/range-builder';

// Routes
import { AuthProtected } from './auth-protected';

// Props passed down to auth protected route
const refreshCookie = Cookies.get('RefreshExist');

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="auth" element={<Auth />}>
        <Route
          element={
            <AuthProtected refreshCookie={refreshCookie} shouldBeLogged={false} redirectPath="/" />
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
        </Route>
      </Route>
    </Routes>
  );
};
