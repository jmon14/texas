import { Switch as MuiSwitch, SwitchProps, Box } from '@mui/material';
import { ReactNode } from 'react';

interface CustomSwitchProps extends SwitchProps {
  icon: ReactNode;
  checkedIcon: ReactNode;
}

const Switch = ({ icon, checkedIcon, ...props }: CustomSwitchProps) => {
  return (
    <MuiSwitch
      {...props}
      icon={<Box className="icon-switch-wrapper">{icon}</Box>}
      checkedIcon={<Box className="icon-switch-wrapper">{checkedIcon}</Box>}
    />
  );
};

Switch.displayName = 'Switch';

export default Switch;
