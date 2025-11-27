import { Meta, StoryObj } from '@storybook/react';
import Action from '../action';
import { ActionDtoTypeEnum } from '../../../../backend-api/api';
import { action } from '@storybook/addon-actions';
import { Box } from '@mui/material';

const meta: Meta<typeof Action> = {
  title: 'Molecules/Action',
  component: Action,
  argTypes: {
    initialAction: {
      control: 'object',
      description: 'The action object containing type and frequency.',
    },
    onChange: {
      action: 'changed',
      description: 'Callback function when the frequency is changed.',
    },
  },
  args: {
    initialAction: { type: ActionDtoTypeEnum.Call, frequency: 50 },
    onChange: action('changed'),
  },
  decorators: [
    (Story) => (
      <Box sx={{ width: '200px' }}>
        <Story />
      </Box>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Action>;

export const Default: Story = {
  args: {
    initialAction: { type: ActionDtoTypeEnum.Call, frequency: 50 },
    onChange: action('changed'),
  },
};

export const FoldAction: Story = {
  args: {
    initialAction: { type: ActionDtoTypeEnum.Fold, frequency: 30 },
    onChange: action('changed'),
  },
};

export const RaiseAction: Story = {
  args: {
    initialAction: { type: ActionDtoTypeEnum.Raise, frequency: 70 },
    onChange: action('changed'),
  },
};
