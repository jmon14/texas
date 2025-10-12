import { Meta, StoryObj } from '@storybook/react';

import { ActionDtoTypeEnum } from '../../../../backend-api/api';
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
        type: ActionDtoTypeEnum.Fold,
        percentage: 0.5,
      },
      {
        type: ActionDtoTypeEnum.Call,
        percentage: 0.3,
      },
      {
        type: ActionDtoTypeEnum.Raise,
        percentage: 0.2,
      },
    ],
  },
};
