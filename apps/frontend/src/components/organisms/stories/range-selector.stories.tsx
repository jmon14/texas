import { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import RangeSelector from '../range-selector';
import rangeReducer from '../../../store/slices/range-slice';

const meta: Meta<typeof RangeSelector> = {
  title: 'Organisms/RangeSelector',
  component: RangeSelector,
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

type Story = StoryObj<typeof RangeSelector>;

export const Default: Story = {};
