import { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Validate from '../validate';
import userReducer from '../../../store/slices/user-slice';

const meta: Meta<typeof Validate> = {
  title: 'Organisms/Validate',
  component: Validate,
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

type Story = StoryObj<typeof Validate>;

export const Default: Story = {};
