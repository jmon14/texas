import { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import RangeBuilder from '../range-builder';
import rangeReducer from '../../../store/slices/range-slice';

const meta: Meta<typeof RangeBuilder> = {
  title: 'Organisms/RangeBuilder',
  component: RangeBuilder,
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
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof RangeBuilder>;

export const Default: Story = {};
