import { Meta, StoryObj } from '@storybook/react';
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
    onDrop: (acceptedFiles) => console.log(acceptedFiles),
  },
};
