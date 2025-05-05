import { Meta, StoryObj } from '@storybook/react';
import CircularProgress from '@mui/material/CircularProgress';

const meta: Meta<typeof CircularProgress> = {
  title: 'Atoms/CircularProgress',
  component: CircularProgress,
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'inherit'],
      description: 'The color of the component.',
    },
    size: {
      control: 'number',
      description: 'The size of the component.',
    },
    thickness: {
      control: 'number',
      description: 'The thickness of the circle.',
    },
    value: {
      control: 'number',
      description: 'The value of the progress indicator for the determinate variant.',
    },
    variant: {
      control: 'select',
      options: ['determinate', 'indeterminate'],
      description: 'The variant to use.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof CircularProgress>;

export const Default: Story = {
  args: {
    color: 'primary',
    size: 40,
    thickness: 3.6,
    variant: 'indeterminate',
  },
};

export const Determinate: Story = {
  args: {
    color: 'primary',
    size: 40,
    thickness: 3.6,
    value: 50,
    variant: 'determinate',
  },
};

export const SecondaryColor: Story = {
  args: {
    color: 'secondary',
    size: 40,
    thickness: 3.6,
    variant: 'indeterminate',
  },
};
