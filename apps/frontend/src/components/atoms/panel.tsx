// React
import { ReactNode } from 'react';

// External libraries
import Paper from '@mui/material/Paper';
import { SxProps, Theme } from '@mui/material/styles';

/**
 * Props for the Panel component
 * @interface PanelProps
 */
type PanelProps = {
  /** Child elements to render inside the panel */
  children: ReactNode;
  /** Optional Material-UI sx prop for custom styling */
  sx?: SxProps<Theme>;
};

/**
 * Panel component wraps content in a Material-UI Paper with consistent padding.
 *
 * A simple container component that provides a card-like appearance with default
 * padding and inline-block display. Extends MUI Paper with preset styling.
 *
 * @component
 * @example
 * ```tsx
 * <Panel>
 *   <Typography variant="h5">Panel Title</Typography>
 *   <Typography>Panel content goes here</Typography>
 * </Panel>
 * ```
 *
 * @example
 * With custom styling
 * ```tsx
 * <Panel sx={{ backgroundColor: 'primary.light', margin: 2 }}>
 *   <Typography>Styled Panel</Typography>
 * </Panel>
 * ```
 *
 * @param {PanelProps} props - The component props
 * @param {ReactNode} props.children - Content to display inside the panel
 * @param {SxProps<Theme>} [props.sx] - Optional sx prop for custom styling
 * @returns {JSX.Element} Rendered panel component
 */
const Panel = ({ children, sx }: PanelProps) => {
  return (
    <Paper sx={[{ padding: 2.5, display: 'inline-block' }, ...(Array.isArray(sx) ? sx : [sx])]}>
      {children}
    </Paper>
  );
};

export default Panel;
