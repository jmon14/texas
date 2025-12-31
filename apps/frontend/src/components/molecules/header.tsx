// React
import { useState } from 'react';

import { AccountCircle, Logout, Menu as MenuIcon, Person } from '@mui/icons-material';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import { Link } from 'react-router-dom';

// Store
import { useAppDispatch } from '../../hooks/store-hooks';
import { logout } from '../../store/slices/user-slice';

// Components
import ThemeSwitch from '../molecules/theme-switch';

/**
 * Props for the Header component
 * @interface HeaderProps
 */
type HeaderProps = {
  /** Callback to toggle sidebar collapse/expand */
  collapseAppbar: () => void;
  /** Whether the sidebar is currently open */
  open: boolean;
};

/**
 * Header component displaying app bar with menu toggle, theme switch, and user menu.
 *
 * Provides navigation controls, theme toggle, and access to user profile and logout.
 * The menu button visibility is controlled by the sidebar open state. Includes a
 * dropdown menu with user information and navigation links.
 *
 * @component
 * @example
 * ```tsx
 * const [sidebarOpen, setSidebarOpen] = useState(false);
 *
 * <Header
 *   open={sidebarOpen}
 *   collapseAppbar={() => setSidebarOpen(!sidebarOpen)}
 * />
 * ```
 *
 * @example
 * In AppBar
 * ```tsx
 * <AppBar position="fixed">
 *   <Toolbar>
 *     <Header
 *       open={drawerOpen}
 *       collapseAppbar={handleDrawerToggle}
 *     />
 *   </Toolbar>
 * </AppBar>
 * ```
 *
 * @param {HeaderProps} props - The component props
 * @param {Function} props.collapseAppbar - Sidebar toggle handler
 * @param {boolean} props.open - Whether sidebar is open
 * @returns {JSX.Element} Rendered header component
 */
const Header = ({ open, collapseAppbar }: HeaderProps) => {
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    dispatch(logout());
    closeMenu();
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        onClick={collapseAppbar}
        sx={{ ...(open && { display: 'none' }) }}
      >
        <MenuIcon />
      </IconButton>
      <ThemeSwitch sx={{ marginLeft: 'auto' }} />
      <IconButton onClick={openMenu} color="inherit">
        <Avatar sx={{ width: 28, height: 28 }}>
          <Person fontSize="medium" />
        </Avatar>
      </IconButton>
      <Menu
        keepMounted
        open={!!anchorEl}
        onClose={closeMenu}
        anchorEl={anchorEl}
        PaperProps={{ style: { width: 220 } }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem disabled>
          <ListItemText primary="John Doe" secondary="jdoe@acme.com" />
        </MenuItem>
        <Divider />
        <MenuItem onClick={closeMenu} component={Link} to="/account">
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText>Sign out</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default Header;
