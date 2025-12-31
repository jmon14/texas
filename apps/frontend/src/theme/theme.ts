// MUI
import { Theme, createTheme, Components } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

declare module '@mui/material/Switch' {
  interface SwitchPropsSizeOverrides {
    large: true;
  }
}

enum Size {
  small = 16,
  medium = 24,
  large = 28,
}

enum FontSize {
  small = 12,
  medium = 16,
  large = 20,
}

const componentsOverride: Components<Theme> = {
  MuiSwitch: {
    styleOverrides: {
      root: ({ ownerState: { color = 'primary', size = 'medium' }, theme }) => ({
        ...(size === 'medium' && {
          '& .MuiSwitch-switchBase': {
            padding: '7px',
          },
        }),
        '& .icon-switch-wrapper': {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '50%',
          width: Size[size],
          height: Size[size],
          fontSize: FontSize[size],
          boxShadow: theme.shadows[1],
          color: color !== 'default' ? theme.palette[color].main : theme.palette.text.primary,
          backgroundColor:
            theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.grey[300],
        },
        '& .Mui-checked': {
          '& .icon-switch-wrapper': {
            color:
              color !== 'default'
                ? theme.palette[color].contrastText
                : theme.palette.primary.contrastText,
            backgroundColor:
              color !== 'default' ? theme.palette[color].main : theme.palette.common.white,
          },
        },
      }),
    },
    variants: [
      {
        props: { size: 'large' },
        style: {
          '&.MuiSwitch-sizeLarge': {
            '& .Mui-checked': {
              transform: 'translateX(30px)',
            },
            '& .MuiSwitch-thumb': {
              width: 28,
              height: 28,
            },

            '& .MuiSwitch-track': {
              borderRadius: 8,
            },
          },
          height: 46,
          padding: 15,
          width: 76,
        },
      },
    ],
  },
  MuiButton: {
    styleOverrides: {
      root: {
        '&.MuiButton-sizeMedium': {
          lineHeight: 24 / 14,
        },
      },
    },
  },
  MuiTypography: {
    // * Base value caused discrepancies with Figma due to decimals
    variants: [
      {
        props: { variant: 'body2' },
        style: {
          lineHeight: 20 / 14,
        },
      },
      {
        props: { variant: 'h4' },
        style: {
          lineHeight: 42 / 34,
        },
      },
      {
        props: { variant: 'h5' },
        style: {
          lineHeight: 32 / 24,
        },
      },
    ],
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        fontSize: 12,
        lineHeight: 14 / 12,
      },
    },
  },
};

export const lightTheme = createTheme({
  components: componentsOverride,
  palette: {
    background: {
      default: grey[100],
    },
    mode: 'light',
  },
});

export const darkTheme = createTheme({
  components: componentsOverride,
  palette: {
    mode: 'dark',
  },
});
