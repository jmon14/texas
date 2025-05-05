// External libraries
import {
  List,
  Divider,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useTheme,
} from '@mui/material';
import { BarChart, ChevronLeft, Dashboard, Upload } from '@mui/icons-material';
import { Link } from 'react-router-dom';

type SidebarProps = {
  collapseSidebar: () => void;
};

const Sidebar = ({ collapseSidebar }: SidebarProps) => {
  const theme = useTheme();

  return (
    <>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          px: [1],
        }}
      >
        <IconButton onClick={collapseSidebar}>
          <ChevronLeft />
        </IconButton>
      </Toolbar>
      <Divider />
      <List component="nav">
        <ListItemButton sx={{ pl: theme.spacing(3) }} component={Link} to="/dashboard">
          <ListItemIcon>
            <Dashboard />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton sx={{ pl: theme.spacing(3) }} component={Link} to="/upload">
          <ListItemIcon>
            <Upload />
          </ListItemIcon>
          <ListItemText primary="Upload" />
        </ListItemButton>
        <ListItemButton sx={{ pl: theme.spacing(3) }} component={Link} to="/range">
          <ListItemIcon>
            <BarChart />
          </ListItemIcon>
          <ListItemText primary="Reports" />
        </ListItemButton>
      </List>
      <Divider />
    </>
  );
};

export default Sidebar;
