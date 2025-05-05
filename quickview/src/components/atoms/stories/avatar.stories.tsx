import { Meta, StoryObj } from '@storybook/react';
import { deepOrange, deepPurple } from '@mui/material/colors';
import Avatar from '@mui/material/Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Atoms/Avatar',
  component: Avatar,
  argTypes: {
    alt: {
      control: 'text',
      description: 'The alt text for the avatar.',
    },
    src: {
      control: 'text',
      description: 'The image URL for the avatar.',
    },
    children: {
      control: 'text',
      description: 'The content of the avatar.',
    },
    sx: {
      control: 'object',
      description:
        'The system prop that allows defining system overrides as well as additional CSS styles.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {
    alt: 'Avatar',
    src: '',
    children: 'A',
    sx: { bgcolor: deepOrange[500] },
  },
};

export const ImageAvatar: Story = {
  args: {
    alt: 'Remy Sharp',
    src: 'https://mui.com/static/images/avatar/1.jpg',
    children: '',
    sx: {},
  },
};

export const LetterAvatar: Story = {
  args: {
    alt: 'Avatar',
    src: '',
    children: 'B',
    sx: { bgcolor: deepPurple[500] },
  },
};
