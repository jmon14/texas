// External libraries
import { Outlet } from 'react-router-dom';

// Components
import CenterLayout from '../templates/center-layout';
import ThemeSwitch from '../molecules/theme-switch';

const Auth = () => {
  const toolbar = () => <ThemeSwitch size="large" />;

  return (
    <CenterLayout renderToolbar={toolbar}>
      <Outlet />
    </CenterLayout>
  );
};

export default Auth;
