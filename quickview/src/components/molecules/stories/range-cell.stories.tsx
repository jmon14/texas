import { Meta, StoryObj } from '@storybook/react';

import { ActionTypeEnum } from '../../../../vision-api';
import RangeCellComp from '../range-cell';

const meta: Meta<typeof RangeCellComp> = {
  title: 'Molecules/RangeCell',
  component: RangeCellComp,
  argTypes: {
    rangeFraction: {
      description: 'Effective range of the cell',
    },
    label: {
      description: 'Hand for which the range is being displayed',
    },
    actions: {
      description: 'Actions that are being performed with the hand',
    },
  },
};

export default meta;

type Story = StoryObj<typeof RangeCellComp>;

export const Default: Story = {
  args: {
    rangeFraction: 0.4,
    label: 'AA',
    actions: [
      {
        type: ActionTypeEnum.Fold,
        percentage: 0.5,
      },
      {
        type: ActionTypeEnum.Call,
        percentage: 0.3,
      },
      {
        type: ActionTypeEnum.Raise,
        percentage: 0.2,
      },
    ],
  },
};
