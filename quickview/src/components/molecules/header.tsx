// React
import { useState } from 'react';

import { AccountCircle, Logout, Menu as MenuIcon, Person } from '@mui/icons-material';
import {
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Menu,
  Avatar,
} from '@mui/material';
import { Link } from 'react-router-dom';

// Store
import { useAppDispatch } from '../../hooks/store-hooks';
import { logout } from '../../store/slices/user-slice';

// Components
import ThemeSwitch from '../molecules/theme-switch';

type HeaderProps = {
  collapseAppbar: () => void;
  open: boolean;
};

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
