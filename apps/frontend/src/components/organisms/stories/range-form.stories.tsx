import { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import RangeForm from '../range-form';
import rangeReducer from '../../../store/slices/range-slice';

const meta: Meta<typeof RangeForm> = {
  title: 'Organisms/RangeForm',
  component: RangeForm,
  decorators: [
    (Story) => {
      const store = configureStore({
        reducer: {
          range: rangeReducer,
        },
      });

      return (
        <Provider store={store}>
          <Story />
        </Provider>
      );
    },
  ],
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj<typeof RangeForm>;

export const Default: Story = {};
