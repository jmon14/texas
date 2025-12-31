// External libraries
import { styled } from '@mui/material/styles';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';

/**
 * Props for the CollapsibleAppBar component
 * @interface CollapsibleAppBarProps
 * @extends {MuiAppBarProps}
 */
export type CollapsibleAppBarProps = MuiAppBarProps & {
  /** Whether the sidebar is open, affecting the app bar's width and margin */
  open?: boolean;
  /** Width of the sidebar in pixels */
  width: number;
};

/**
 * CollapsibleAppbar is a styled Material-UI AppBar that adjusts its width and position
 * based on the sidebar's open/closed state.
 *
 * When the sidebar is open, the app bar shifts to the right and reduces its width
 * to accommodate the sidebar. Includes smooth transitions for width and margin changes.
 *
 * @component
 * @example
 * ```tsx
 * With closed sidebar
 * <CollapsibleAppbar width={240} open={false} position="fixed">
 *   <Toolbar>
 *     <Typography>App Title</Typography>
 *   </Toolbar>
 * </CollapsibleAppbar>
 * ```
 *
 * @example
 * With open sidebar
 * ```tsx
 * <CollapsibleAppbar width={240} open={true} position="fixed">
 *   <Toolbar>
 *     <IconButton onClick={handleMenuClick}>
 *       <MenuIcon />
 *     </IconButton>
 *     <Typography>App Title</Typography>
 *   </Toolbar>
 * </CollapsibleAppbar>
 * ```
 *
 * @param {CollapsibleAppBarProps} props - Component props including MUI AppBar props
 * @param {boolean} [props.open] - Whether sidebar is open
 * @param {number} props.width - Sidebar width in pixels
 */
const CollapsibleAppbar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open' && prop !== 'width',
})<CollapsibleAppBarProps>(({ theme, open, width }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${width}px)`,
    marginLeft: `${width}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default CollapsibleAppbar;
