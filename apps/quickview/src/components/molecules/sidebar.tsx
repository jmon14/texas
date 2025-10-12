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
import { BarChart, ChevronLeft } from '@mui/icons-material';
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
        <ListItemButton sx={{ pl: theme.spacing(3) }} component={Link} to="/range">
          <ListItemIcon>
            <BarChart />
          </ListItemIcon>
          <ListItemText primary="Range builder" />
        </ListItemButton>
      </List>
      <Divider />
    </>
  );
};

export default Sidebar;
