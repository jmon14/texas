import { Meta, StoryObj } from '@storybook/react';
import LinearProgress from '@mui/material/LinearProgress';

const meta: Meta<typeof LinearProgress> = {
  title: 'Atoms/LinearProgress',
  component: LinearProgress,
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'error', 'info', 'success', 'warning'],
      description: 'The color of the component.',
    },
    variant: {
      control: 'select',
      options: ['determinate', 'indeterminate', 'buffer', 'query'],
      description: 'The variant to use.',
    },
    value: {
      control: 'number',
      description: 'The value of the progress indicator for the determinate and buffer variants.',
    },
    valueBuffer: {
      control: 'number',
      description: 'The value for the buffer variant.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof LinearProgress>;

export const Default: Story = {
  args: {
    color: 'primary',
    variant: 'indeterminate',
  },
};

export const Determinate: Story = {
  args: {
    color: 'primary',
    variant: 'determinate',
    value: 50,
  },
};

export const Buffer: Story = {
  args: {
    color: 'primary',
    variant: 'buffer',
    value: 50,
    valueBuffer: 75,
  },
};

export const Query: Story = {
  args: {
    color: 'primary',
    variant: 'query',
  },
};
