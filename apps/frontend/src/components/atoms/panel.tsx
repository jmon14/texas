// React
import { ReactNode } from 'react';

// External libraries
import Paper from '@mui/material/Paper';
import { SxProps, Theme } from '@mui/material/styles';

type PanelProps = {
  children: ReactNode;
  sx?: SxProps<Theme>;
};

const Panel = ({ children, sx }: PanelProps) => {
  return (
    <Paper sx={[{ padding: 2.5, display: 'inline-block' }, ...(Array.isArray(sx) ? sx : [sx])]}>
      {children}
    </Paper>
  );
};

export default Panel;
