// External libraries
import MuiDrawer, { DrawerProps as MuiDrawerProps } from '@mui/material/Drawer';
import { styled } from '@mui/material/styles';

/**
 * Props for the CollapsibleDrawer component
 * @interface CollapsibleDrawerProps
 * @extends {MuiDrawerProps}
 */
export type CollapsibleDrawerProps = MuiDrawerProps & {
  /** Whether the drawer is open (full width) or collapsed (icon-only width) */
  open: boolean;
  /** Full width of the drawer when open, in pixels */
  width: number;
};

/**
 * CollapsibleDrawer is a styled Material-UI Drawer that smoothly transitions between
 * full width and a collapsed icon-only width.
 *
 * When collapsed, shows only icons at theme.spacing(9) width. When open, expands to
 * the full specified width. Includes smooth transitions and handles overflow properly
 * to prevent text from showing when collapsed.
 *
 * @component
 * @example
 * ```tsx
 * Collapsed drawer (icon-only)
 * <CollapsibleDrawer open={false} width={240} variant="permanent">
 *   <List>
 *     <ListItem button>
 *       <ListItemIcon><HomeIcon /></ListItemIcon>
 *       <ListItemText primary="Home" />
 *     </ListItem>
 *   </List>
 * </CollapsibleDrawer>
 * ```
 *
 * @example
 * Expanded drawer (full width)
 * ```tsx
 * <CollapsibleDrawer open={true} width={240} variant="permanent">
 *   <Toolbar />
 *   <List>
 *     <ListItem button>
 *       <ListItemIcon><HomeIcon /></ListItemIcon>
 *       <ListItemText primary="Home" />
 *     </ListItem>
 *     <ListItem button>
 *       <ListItemIcon><SettingsIcon /></ListItemIcon>
 *       <ListItemText primary="Settings" />
 *     </ListItem>
 *   </List>
 * </CollapsibleDrawer>
 * ```
 *
 * @param {CollapsibleDrawerProps} props - Component props including MUI Drawer props
 * @param {boolean} props.open - Whether drawer is expanded or collapsed
 * @param {number} props.width - Full width when open, in pixels
 */
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
