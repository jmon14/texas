// External libraries
import { Outlet } from 'react-router-dom';

// Components
import MainLayout from '../templates/main-layout';
import Header from '../molecules/header';
import Sidebar from '../molecules/sidebar';

const Home = () => {
  return (
    <MainLayout
      renderHeader={(open, collapseAppbar) => (
        <Header open={open} collapseAppbar={collapseAppbar} />
      )}
      renderSidebar={(collapseSidebar) => <Sidebar collapseSidebar={collapseSidebar} />}
    >
      <Outlet />
    </MainLayout>
  );
};

export default Home;
