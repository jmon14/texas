import { Meta, StoryObj } from '@storybook/react';

import { ActionDtoTypeEnum } from '../../../../ultron-api/api';
import ActionList from '../action-list';

const meta: Meta<typeof ActionList> = {
  title: 'Organisms/ActionList',
  component: ActionList,
};

export default meta;

type Story = StoryObj<typeof ActionList>;

export const Default: Story = {
  args: {
    actions: [
      { type: ActionDtoTypeEnum.Fold, percentage: 50 },
      { type: ActionDtoTypeEnum.Call, percentage: 30 },
      { type: ActionDtoTypeEnum.Raise, percentage: 20 },
    ],
    onActionChange: (actions) => console.log('Actions changed:', actions),
  },
};
