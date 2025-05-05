import { Meta, StoryObj } from '@storybook/react';

import { ActionTypeEnum } from '../../../../vision-api';
import DummyCell from '../cell';
import { Box } from '@mui/material';

const meta: Meta<typeof DummyCell> = {
  title: 'Atoms/Cell',
  component: DummyCell,
  decorators: [
    (Story) => (
      <Box sx={{ width: '64px', height: '64px' }}>
        <Story />
      </Box>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof DummyCell>;

export const Cell: Story = {
  args: {
    label: 'AA',
    rangeFraction: 0.4,
    actions: [
      { type: ActionTypeEnum.Fold, percentage: 0.5 },
      { type: ActionTypeEnum.Call, percentage: 0.3 },
      { type: ActionTypeEnum.Raise, percentage: 0.2 },
    ],
  },
};
