import { Meta, StoryObj } from '@storybook/react';

import PanelComp from '../panel';

const meta: Meta<typeof PanelComp> = {
  title: 'Atoms/Panel',
  component: PanelComp,
};

export default meta;

type Story = StoryObj<typeof PanelComp>;

export const Panel: Story = {
  args: {
    children: 'Panel content',
    sx: { width: 200 },
  },
};
