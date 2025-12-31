import { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import NewPassword from '../new-password';
import userReducer from '../../../store/slices/user-slice';

const meta: Meta<typeof NewPassword> = {
  title: 'Organisms/NewPassword',
  component: NewPassword,
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
            <Routes>
              <Route path="*" element={<Story />} />
            </Routes>
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

type Story = StoryObj<typeof NewPassword>;

export const Default: Story = {};
