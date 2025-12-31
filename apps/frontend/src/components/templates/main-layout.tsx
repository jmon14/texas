// React
import { useState, ReactNode } from 'react';

// External libraries
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

// Components
import CollapsibleAppbar from '../atoms/collapsible-appbar';
import CollapsibleDrawer from '../atoms/collapsible-drawer';

// Constants
import { drawerWidth } from '../../constants';

type MainLayoutProps = {
  children: ReactNode;
  renderHeader: (open: boolean, collapseAppbar: () => void) => ReactNode;
  renderSidebar: (open: boolean, collapseSidebar: () => void) => ReactNode;
};

const MainLayout = ({ renderHeader, renderSidebar, children }: MainLayoutProps) => {
  const [open, setOpen] = useState(false);

  const toggleSidebar = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <CollapsibleAppbar position="fixed" open={open} width={drawerWidth}>
        <Toolbar>{renderHeader(open, toggleSidebar)}</Toolbar>
      </CollapsibleAppbar>
      <CollapsibleDrawer variant="permanent" open={open} width={drawerWidth}>
        {renderSidebar(open, toggleSidebar)}
      </CollapsibleDrawer>
      <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Toolbar />
        <Box sx={{ p: 3, flexGrow: 1, overflowY: 'auto' }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
