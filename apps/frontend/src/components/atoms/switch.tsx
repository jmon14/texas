import MuiSwitch, { SwitchProps } from '@mui/material/Switch';
import Box from '@mui/material/Box';
import { ReactNode } from 'react';

/**
 * Props for the custom Switch component
 * @interface CustomSwitchProps
 * @extends {SwitchProps}
 */
interface CustomSwitchProps extends SwitchProps {
  /** Icon to display when switch is off/unchecked */
  icon: ReactNode;
  /** Icon to display when switch is on/checked */
  checkedIcon: ReactNode;
}

/**
 * Custom Switch component that displays custom icons for checked and unchecked states.
 *
 * Wraps Material-UI Switch to allow custom icon rendering instead of default switch UI.
 * Useful for theme toggles (light/dark icons), visibility toggles (eye icons), or
 * any binary state that benefits from visual icon representation.
 *
 * @component
 * @example
 * ```tsx
 * import { LightMode, DarkMode } from '@mui/icons-material';
 *
 * <Switch
 *   checked={isDarkMode}
 *   onChange={handleThemeChange}
 *   icon={<LightMode />}
 *   checkedIcon={<DarkMode />}
 * />
 * ```
 *
 * @example
 * Visibility toggle
 * ```tsx
 * import { Visibility, VisibilityOff } from '@mui/icons-material';
 *
 * <Switch
 *   checked={isVisible}
 *   onChange={handleVisibilityChange}
 *   icon={<VisibilityOff />}
 *   checkedIcon={<Visibility />}
 * />
 * ```
 *
 * @param {CustomSwitchProps} props - The component props
 * @param {ReactNode} props.icon - Icon to show when unchecked
 * @param {ReactNode} props.checkedIcon - Icon to show when checked
 * @param {SwitchProps} props - All other Material-UI Switch props
 * @returns {JSX.Element} Rendered switch component with custom icons
 */
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
