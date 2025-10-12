import { Meta, StoryObj } from '@storybook/react';
import { LightModeOutlined, DarkModeOutlined } from '@mui/icons-material';
import Switch from '../switch';

// ? Figure out why displayName was needed for this to work
const meta: Meta<typeof Switch> = {
  title: 'Atoms/Switch',
  component: Switch,
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'If true, the component is checked.',
    },
    disabled: {
      control: 'boolean',
      description: 'If true, the component is disabled.',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'The size of the component.',
    },
    color: {
      control: 'select',
      options: ['default', 'primary', 'secondary'],
      description: 'The color of the component.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Switch>;

// ? Find out why this is needed for this story and not for others
const parameters = {
  controls: {
    include: ['checked', 'disabled', 'size', 'color'],
  },
};

export const Default: Story = {
  args: {
    checked: false,
    disabled: false,
    size: 'medium',
    color: 'primary',
    icon: <LightModeOutlined fontSize="inherit" />,
    checkedIcon: <DarkModeOutlined fontSize="inherit" />,
  },
};

Default.parameters = parameters;

export const Checked: Story = {
  args: {
    checked: true,
    disabled: false,
    size: 'medium',
    color: 'primary',
    icon: <LightModeOutlined fontSize="inherit" />,
    checkedIcon: <DarkModeOutlined fontSize="inherit" />,
  },
};

Checked.parameters = parameters;

export const Disabled: Story = {
  args: {
    checked: false,
    disabled: true,
    size: 'medium',
    color: 'primary',
    icon: <LightModeOutlined fontSize="inherit" />,
    checkedIcon: <DarkModeOutlined fontSize="inherit" />,
  },
};

Disabled.parameters = parameters;
