import { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import DropzoneComp from '../dropzone';

const meta: Meta<typeof DropzoneComp> = {
  title: 'Molecules/Dropzone',
  component: DropzoneComp,
  argTypes: {
    onDrop: {
      description: 'Callback function to handle the dropped files',
    },
    config: {
      description: 'Configuration object for the dropzone',
    },
  },
};

export default meta;

type Story = StoryObj<typeof DropzoneComp>;

export const Dropzone: Story = {
  args: {
    onDrop: action('files-dropped'),
  },
};
