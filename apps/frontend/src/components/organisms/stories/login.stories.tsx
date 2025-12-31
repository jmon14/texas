import { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Login from '../login';
import userReducer from '../../../store/slices/user-slice';
import { FetchStatus } from '../../../constants';

const meta: Meta<typeof Login> = {
  title: 'Organisms/Login',
  component: Login,
  decorators: [
    (Story) => {
      const store = configureStore({
        reducer: {
          user: userReducer,
        },
      });

      return (
        <Provider store={store}>
          <BrowserRouter>
            <Story />
          </BrowserRouter>
        </Provider>
      );
    },
  ],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof Login>;

export const Default: Story = {};

export const WithError: Story = {
  decorators: [
    (Story) => {
      const store = configureStore({
        reducer: {
          user: userReducer,
        },
        preloadedState: {
          user: {
            error: 'Invalid email or password',
            status: FetchStatus.FAILED,
            user: undefined,
            resendVerificationStatus: FetchStatus.IDDLE,
            resendVerificationError: null,
            resetPasswordStatus: FetchStatus.IDDLE,
            resetPasswordError: null,
          },
        },
      });

      return (
        <Provider store={store}>
          <BrowserRouter>
            <Story />
          </BrowserRouter>
        </Provider>
      );
    },
  ],
};
