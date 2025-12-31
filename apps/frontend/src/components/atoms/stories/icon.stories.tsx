import { Meta, StoryObj } from '@storybook/react';
import Icon from '@mui/material/Icon';
import { Home, Settings, AccountCircle } from '@mui/icons-material';

const meta: Meta<typeof Icon> = {
  title: 'Atoms/Icon',
  component: Icon,
  argTypes: {
    color: {
      control: 'select',
      options: ['inherit', 'primary', 'secondary', 'action', 'error', 'disabled'],
      description: 'The color of the component.',
    },
    fontSize: {
      control: 'select',
      options: ['inherit', 'small', 'medium', 'large'],
      description: 'The fontSize applied to the icon.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  render: (args) => <Home color={args.color} fontSize={args.fontSize} />,
  args: {
    color: 'inherit',
    fontSize: 'medium',
  },
};

export const Primary: Story = {
  render: (args) => <Settings color={args.color} fontSize={args.fontSize} />,
  args: {
    color: 'primary',
    fontSize: 'large',
  },
};

export const Secondary: Story = {
  render: (args) => <AccountCircle color={args.color} fontSize={args.fontSize} />,
  args: {
    color: 'secondary',
    fontSize: 'small',
  },
};
