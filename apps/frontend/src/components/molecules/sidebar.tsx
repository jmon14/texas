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
import { BarChart, ChevronLeft, List as ListIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

type SidebarProps = {
  open: boolean;
  collapseSidebar: () => void;
};

const Sidebar = ({ open, collapseSidebar }: SidebarProps) => {
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
          <ListItemText
            primary="Range builder"
            sx={{
              opacity: open ? 1 : 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              transition: 'opacity 0.3s ease, visibility 0.3s ease',
            }}
          />
        </ListItemButton>
        <ListItemButton sx={{ pl: theme.spacing(3) }} component={Link} to="/scenarios">
          <ListItemIcon>
            <ListIcon />
          </ListItemIcon>
          <ListItemText
            primary="Scenarios"
            sx={{
              opacity: open ? 1 : 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              transition: 'opacity 0.3s ease, visibility 0.3s ease',
            }}
          />
        </ListItemButton>
      </List>
      <Divider />
    </>
  );
};

export default Sidebar;
