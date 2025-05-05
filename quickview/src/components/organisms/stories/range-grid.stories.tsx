import { Meta, StoryObj } from '@storybook/react';

import RangeGridComp from '../range-grid';
import { defaultHandRange } from '../../../constants';

const meta: Meta<typeof RangeGridComp> = {
  title: 'Organisms/RangeGrid',
  component: RangeGridComp,
};

export default meta;

type Story = StoryObj<typeof RangeGridComp>;

export const DefaultStateGrid: Story = {
  args: {
    range: {
      name: 'UTG',
      handsRange: defaultHandRange,
    },
  },
};
