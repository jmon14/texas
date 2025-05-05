// External libraries
import { DarkModeOutlined, LightModeOutlined } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../hooks/store-hooks';
import { setTheme } from '../../store/slices/theme-slice';

// Components
import Switch from '../atoms/switch';
import { SwitchProps, SxProps, Theme } from '@mui/material';

type ThemeSwitchProps = SwitchProps & {
  sx?: SxProps<Theme>;
};

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
