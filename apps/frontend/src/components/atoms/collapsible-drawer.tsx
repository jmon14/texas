// External libraries
import MuiDrawer, { DrawerProps as MuiDrawerProps } from '@mui/material/Drawer';
import { styled } from '@mui/material';

export type CollapsibleDrawerProps = MuiDrawerProps & {
  open: boolean;
  width: number;
};

const CollapsibleDrawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open' && prop !== 'width',
})<CollapsibleDrawerProps>(({ theme, open, width }) => {
  const enterTransition = theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  });

  const leaveTransition = theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  });

  const transition = open ? enterTransition : leaveTransition;
  const drawerWidth = open ? width : theme.spacing(9);

  return {
    transition,
    width: drawerWidth,
    '& .MuiDrawer-paper': {
      transition,
      width: drawerWidth,
      overflowX: 'hidden',
    },
  };
});

export default CollapsibleDrawer;
