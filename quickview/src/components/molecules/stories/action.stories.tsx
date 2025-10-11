import { Meta, StoryObj } from '@storybook/react';
import Action from '../action';
import { ActionDtoTypeEnum } from '../../../../ultron-api/api';
import { action } from '@storybook/addon-actions';
import { Box } from '@mui/material';

const meta: Meta<typeof Action> = {
  title: 'Molecules/Action',
  component: Action,
  argTypes: {
    initialAction: {
      control: 'object',
      description: 'The action object containing type and percentage.',
    },
    onChange: {
      action: 'changed',
      description: 'Callback function when the percentage is changed.',
    },
  },
  args: {
    initialAction: { type: ActionDtoTypeEnum.Call, percentage: 0.5 },
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
    initialAction: { type: ActionDtoTypeEnum.Call, percentage: 50 },
    onChange: action('changed'),
  },
};

export const FoldAction: Story = {
  args: {
    initialAction: { type: ActionDtoTypeEnum.Fold, percentage: 30 },
    onChange: action('changed'),
  },
};

export const RaiseAction: Story = {
  args: {
    initialAction: { type: ActionDtoTypeEnum.Raise, percentage: 70 },
    onChange: action('changed'),
  },
};
