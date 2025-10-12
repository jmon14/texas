import { Meta, StoryObj } from '@storybook/react';
import Typography from '@mui/material/Typography';

const meta: Meta<typeof Typography> = {
  title: 'Atoms/Typography',
  component: Typography,
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'subtitle1',
        'subtitle2',
        'body1',
        'body2',
        'caption',
        'button',
        'overline',
      ],
      description: 'The variant to use.',
    },
    color: {
      control: 'select',
      options: [
        'initial',
        'inherit',
        'primary',
        'secondary',
        'textPrimary',
        'textSecondary',
        'error',
      ],
      description: 'The color of the component.',
    },
    align: {
      control: 'select',
      options: ['inherit', 'left', 'center', 'right', 'justify'],
      description: 'Set the text-align on the component.',
    },
    gutterBottom: {
      control: 'boolean',
      description: 'If true, the text will have a bottom margin.',
    },
  },
  args: {
    variant: 'body1',
    color: 'initial',
    align: 'inherit',
    gutterBottom: false,
    children: 'Hello, World!',
  },
};

export default meta;

type Story = StoryObj<typeof Typography>;

export const Default: Story = {
  args: {
    variant: 'body1',
    color: 'initial',
    align: 'inherit',
    gutterBottom: false,
    children: 'Hello, World!',
  },
};

export const Heading: Story = {
  args: {
    variant: 'h1',
    color: 'primary',
    align: 'center',
    gutterBottom: true,
    children: 'Heading Example',
  },
};

export const Subtitle: Story = {
  args: {
    variant: 'subtitle1',
    color: 'secondary',
    align: 'left',
    gutterBottom: true,
    children: 'Subtitle Example',
  },
};
