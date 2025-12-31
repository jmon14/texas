import { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ThemeSwitch from '../theme-switch';
import themeReducer from '../../../store/slices/theme-slice';

const meta: Meta<typeof ThemeSwitch> = {
  title: 'Molecules/ThemeSwitch',
  component: ThemeSwitch,
  decorators: [
    (Story) => {
      const store = configureStore({
        reducer: {
          theme: themeReducer,
        },
      });

      return (
        <Provider store={store}>
          <Story />
        </Provider>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof ThemeSwitch>;

export const Default: Story = {};

export const WithCustomStyling: Story = {
  args: {
    sx: { marginLeft: 2 },
  },
};
