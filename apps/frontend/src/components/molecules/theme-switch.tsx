// External libraries
import { DarkModeOutlined, LightModeOutlined } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../hooks/store-hooks';
import { setTheme } from '../../store/slices/theme-slice';

// Components
import Switch from '../atoms/switch';
import { SwitchProps } from '@mui/material/Switch';
import { SxProps, Theme } from '@mui/material/styles';

/**
 * Props for the ThemeSwitch component
 * @interface ThemeSwitchProps
 * @extends {SwitchProps}
 */
type ThemeSwitchProps = SwitchProps & {
  /** Optional Material-UI sx prop for custom styling */
  sx?: SxProps<Theme>;
};

/**
 * ThemeSwitch component for toggling between light and dark themes.
 *
 * Connected to Redux store to persist theme preference. Displays sun icon for light mode
 * and moon icon for dark mode. Automatically syncs with application theme state.
 *
 * @component
 * @example
 * ```tsx
 * Basic usage
 * <ThemeSwitch />
 * ```
 *
 * @example
 * With custom styling
 * ```tsx
 * <ThemeSwitch sx={{ marginLeft: 'auto' }} />
 * ```
 *
 * @example
 * In a toolbar
 * ```tsx
 * <Toolbar>
 *   <Typography variant="h6">App Title</Typography>
 *   <ThemeSwitch sx={{ ml: 'auto' }} />
 * </Toolbar>
 * ```
 *
 * @param {ThemeSwitchProps} props - Component props including MUI Switch props
 * @param {SxProps<Theme>} [props.sx] - Optional sx styling
 * @returns {JSX.Element} Rendered theme switch component
 */
const ThemeSwitch = ({ sx, ...props }: ThemeSwitchProps) => {
  const dispatch = useAppDispatch();
  const { mode } = useAppSelector((state) => state.theme);

  const onThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setTheme(event.target.checked ? 'dark' : 'light'));
  };

  return (
    <Switch
      sx={sx}
      size="medium"
      checked={mode === 'dark'}
      onChange={onThemeChange}
      icon={<LightModeOutlined fontSize="inherit" />}
      checkedIcon={<DarkModeOutlined fontSize="inherit" />}
      {...props}
    />
  );
};

export default ThemeSwitch;
