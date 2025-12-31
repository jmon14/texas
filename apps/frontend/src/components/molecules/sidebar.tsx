// External libraries
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import { BarChart, ChevronLeft, List as ListIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

/**
 * Props for the Sidebar component
 * @interface SidebarProps
 */
type SidebarProps = {
  /** Whether the sidebar is expanded or collapsed */
  open: boolean;
  /** Callback to collapse/toggle the sidebar */
  collapseSidebar: () => void;
};

/**
 * Sidebar component providing navigation menu with collapsible behavior.
 *
 * Displays application navigation links with smooth text fade transitions when
 * collapsed. Includes a collapse toggle button and navigation items for Range Builder
 * and Scenarios sections. Text labels fade out when collapsed while icons remain visible.
 *
 * @component
 * @example
 * ```tsx
 * Basic usage with collapse handler
 * const [sidebarOpen, setSidebarOpen] = useState(true);
 *
 * <Sidebar
 *   open={sidebarOpen}
 *   collapseSidebar={() => setSidebarOpen(false)}
 * />
 * ```
 *
 * @example
 * In a layout with drawer
 * ```tsx
 * <Drawer variant="permanent" open={open}>
 *   <Sidebar open={open} collapseSidebar={handleDrawerClose} />
 * </Drawer>
 * ```
 *
 * @example
 * Controlled sidebar state
 * ```tsx
 * const [open, setOpen] = useState(true);
 *
 * <Sidebar
 *   open={open}
 *   collapseSidebar={() => setOpen(!open)}
 * />
 * ```
 *
 * @param {SidebarProps} props - The component props
 * @param {boolean} props.open - Whether sidebar is expanded
 * @param {Function} props.collapseSidebar - Sidebar collapse handler
 * @returns {JSX.Element} Rendered sidebar navigation component
 */
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
