import { Meta, StoryObj } from '@storybook/react';
import { Link } from '@mui/material';

// TODO - Find out why cursor: pointer is not set a:-webkit-any-link
const meta: Meta<typeof Link> = {
  title: 'Atoms/Link',
  component: Link,
  argTypes: {
    children: {
      control: 'text',
      description: 'The content of the link.',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'textPrimary', 'textSecondary', 'error'],
      description: 'The color of the link.',
    },
    variant: {
      control: 'select',
      options: [
        'inherit',
        'body1',
        'body2',
        'button',
        'caption',
        'overline',
        'subtitle1',
        'subtitle2',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
      ],
      description: 'The variant to use.',
    },
    underline: {
      control: 'select',
      options: ['none', 'hover', 'always'],
      description: 'The underline behavior of the link.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Link>;

export const Default: Story = {
  args: {
    children: 'Example Link',
    color: 'primary',
    variant: 'body1',
    underline: 'hover',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Link',
    color: 'secondary',
    variant: 'body1',
    underline: 'hover',
  },
};

export const Error: Story = {
  args: {
    children: 'Error Link',
    color: 'error',
    variant: 'body1',
    underline: 'hover',
  },
};
