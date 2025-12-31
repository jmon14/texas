import { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import ResetPassword from '../reset-password';
import userReducer from '../../../store/slices/user-slice';

const meta: Meta<typeof ResetPassword> = {
  title: 'Organisms/ResetPassword',
  component: ResetPassword,
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

type Story = StoryObj<typeof ResetPassword>;

export const Default: Story = {};
