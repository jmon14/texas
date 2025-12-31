import { Meta, StoryObj } from '@storybook/react';
import Files from '../files';

const meta: Meta<typeof Files> = {
  title: 'Organisms/Files',
  component: Files,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof Files>;

export const Default: Story = {};
