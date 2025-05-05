// React
import { ReactNode } from 'react';

// External libraries
import { Box, Toolbar } from '@mui/material';

// Components
import FullCenter from '../atoms/center';
import Panel from '../atoms/panel';

type CenterLayoutProps = {
  renderToolbar: () => ReactNode;
  children: ReactNode;
};

// The auth layout is displayed in the whole screen with content centered
const CenterLayout = ({ renderToolbar, children }: CenterLayoutProps) => {
  return (
    <Box
      sx={{
        height: '100%',
      }}
    >
      <Toolbar sx={{ position: 'absolute', width: '100%', justifyContent: 'end' }}>
        {renderToolbar()}
      </Toolbar>
      <FullCenter>
        <Panel>{children}</Panel>
      </FullCenter>
    </Box>
  );
};

export default CenterLayout;
