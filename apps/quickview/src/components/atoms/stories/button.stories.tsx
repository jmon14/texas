import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import Button from '@mui/material/Button';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['text', 'outlined', 'contained'],
      description: 'The variant to use.',
    },
    color: {
      control: 'select',
      options: [
        'default',
        'inherit',
        'primary',
        'secondary',
        'error',
        'info',
        'success',
        'warning',
      ],
      description: 'The color of the component.',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'The size of the component.',
    },
    disabled: {
      control: 'boolean',
      description: 'If true, the component is disabled.',
    },
  },
  args: {
    onClick: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    variant: 'contained',
    color: 'primary',
    size: 'medium',
    disabled: false,
    children: 'Button',
  },
};

export const TextButton: Story = {
  args: {
    variant: 'text',
    color: 'primary',
    size: 'medium',
    disabled: false,
    children: 'Text Button',
  },
};

export const OutlinedButton: Story = {
  args: {
    variant: 'outlined',
    color: 'primary',
    size: 'medium',
    disabled: false,
    children: 'Outlined Button',
  },
};

export const DisabledButton: Story = {
  args: {
    variant: 'contained',
    color: 'primary',
    size: 'medium',
    disabled: true,
    children: 'Disabled Button',
  },
};
