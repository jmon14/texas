import { Meta, StoryObj } from '@storybook/react';
import DifficultyBadge from '../difficulty-badge';
import { ScenarioResponseDtoDifficultyEnum } from '../../../../backend-api/api';

const meta: Meta<typeof DifficultyBadge> = {
  title: 'Atoms/DifficultyBadge',
  component: DifficultyBadge,
  argTypes: {
    difficulty: {
      control: 'select',
      options: Object.values(ScenarioResponseDtoDifficultyEnum),
      description: 'The difficulty level to display',
    },
  },
};

export default meta;

type Story = StoryObj<typeof DifficultyBadge>;

export const Beginner: Story = {
  args: {
    difficulty: ScenarioResponseDtoDifficultyEnum.Beginner,
  },
};

export const Intermediate: Story = {
  args: {
    difficulty: ScenarioResponseDtoDifficultyEnum.Intermediate,
  },
};

export const Advanced: Story = {
  args: {
    difficulty: ScenarioResponseDtoDifficultyEnum.Advanced,
  },
};
