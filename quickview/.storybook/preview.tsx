import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/material-icons';

import React, { useMemo } from 'react';
import { Preview } from '@storybook/react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { initialize, mswLoader } from 'msw-storybook-addon';

import { lightTheme, darkTheme } from '../src/theme/theme';

initialize();

const THEMES = {
  light: lightTheme,
  dark: darkTheme,
};

const withMuiTheme = (Story, context) => {
  // The theme global we just declared
  const { theme: themeKey } = context.globals;

  // only recompute the theme if the themeKey changes
  const theme = useMemo(() => THEMES[themeKey] || THEMES['light'], [themeKey]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Story />
    </ThemeProvider>
  );
};

const preview: Preview = {
  tags: ['autodocs'],
  loaders: [mswLoader],
  parameters: {
    controls: { expanded: true },
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      title: 'Theme',
      description: 'Theme for your components',
      defaultValue: 'light',
      toolbar: {
        icon: 'paintbrush',
        dynamicTitle: true,
        items: [
          { value: 'light', title: 'Light mode' },
          { value: 'dark', title: 'Dark mode' },
        ],
      },
    },
  },
  decorators: [withMuiTheme],
};

export default preview;
