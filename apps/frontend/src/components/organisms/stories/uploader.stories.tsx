import { Meta, StoryObj } from '@storybook/react';
import Uploader from '../uploader';

const meta: Meta<typeof Uploader> = {
  title: 'Organisms/Uploader',
  component: Uploader,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof Uploader>;

export const Default: Story = {};
