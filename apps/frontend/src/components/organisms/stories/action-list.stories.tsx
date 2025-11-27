import { Meta, StoryObj } from '@storybook/react';

import { ActionDtoTypeEnum } from '../../../../backend-api/api';
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
      { type: ActionDtoTypeEnum.Fold, frequency: 50 },
      { type: ActionDtoTypeEnum.Call, frequency: 30 },
      { type: ActionDtoTypeEnum.Raise, frequency: 20 },
    ],
    onActionChange: (actions) => console.log('Actions changed:', actions),
  },
};
