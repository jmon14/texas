import { Meta, StoryObj } from '@storybook/react';

import { ActionDtoTypeEnum } from '../../../../backend-api/api';
import DummyCell from '../cell';
import Box from '@mui/material/Box';

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
    carryoverFrequency: 40,
    actions: [
      { type: ActionDtoTypeEnum.Fold, frequency: 50 },
      { type: ActionDtoTypeEnum.Call, frequency: 30 },
      { type: ActionDtoTypeEnum.Raise, frequency: 20 },
    ],
  },
};
