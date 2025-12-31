// External libraries
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

/**
 * FullCenter is a styled Box component that centers its children both vertically and horizontally.
 *
 * Uses flexbox to center content in both directions, taking up 100% height of its parent.
 * Useful for creating centered layouts, modals, loading states, or empty state screens.
 *
 * @component
 * @example
 * ```tsx
 * <FullCenter>
 *   <Typography>Centered Content</Typography>
 * </FullCenter>
 * ```
 *
 * @example
 * With loading spinner
 * ```tsx
 * <FullCenter>
 *   <CircularProgress />
 * </FullCenter>
 * ```
 */
const FullCenter = styled(Box)({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export default FullCenter;
