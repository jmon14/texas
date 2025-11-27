import { Meta, StoryObj } from '@storybook/react';

import { ActionDtoTypeEnum } from '../../../../backend-api/api';
import RangeCellComp from '../range-cell';

const meta: Meta<typeof RangeCellComp> = {
  title: 'Molecules/RangeCell',
  component: RangeCellComp,
  argTypes: {
    carryoverFrequency: {
      description: 'Carryover frequency from previous street (0-100)',
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
    carryoverFrequency: 40,
    label: 'AA',
    actions: [
      {
        type: ActionDtoTypeEnum.Fold,
        frequency: 50,
      },
      {
        type: ActionDtoTypeEnum.Call,
        frequency: 30,
      },
      {
        type: ActionDtoTypeEnum.Raise,
        frequency: 20,
      },
    ],
  },
};
