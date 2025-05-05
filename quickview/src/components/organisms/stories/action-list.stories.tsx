import { Meta, StoryObj } from '@storybook/react';

import { ActionTypeEnum } from '../../../../vision-api';
import ActionList from '../action-list';

const meta: Meta<typeof ActionList> = {
  title: 'Organisms/ActionList',
  component: ActionList,
};

export default meta;

type Story = StoryObj<typeof ActionList>;

export const Default: Story = {
  args: {
    initialActions: [
      { type: ActionTypeEnum.Fold, percentage: 50 },
      { type: ActionTypeEnum.Call, percentage: 30 },
      { type: ActionTypeEnum.Raise, percentage: 20 },
    ],
  },
};
