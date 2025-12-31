import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import Header from '../header';
import themeReducer from '../../../store/slices/theme-slice';
import userReducer from '../../../store/slices/user-slice';

const meta: Meta<typeof Header> = {
  title: 'Molecules/Header',
  component: Header,
  decorators: [
    (Story) => {
      const store = configureStore({
        reducer: {
          theme: themeReducer,
          user: userReducer,
        },
      });

      return (
        <Provider store={store}>
          <BrowserRouter>
            <AppBar position="static">
              <Toolbar>
                <Story />
              </Toolbar>
            </AppBar>
          </BrowserRouter>
        </Provider>
      );
    },
  ],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Whether the sidebar is open',
    },
    collapseAppbar: {
      description: 'Callback to toggle sidebar',
    },
  },
  args: {
    collapseAppbar: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof Header>;

export const SidebarClosed: Story = {
  args: {
    open: false,
  },
};

export const SidebarOpen: Story = {
  args: {
    open: true,
  },
};
