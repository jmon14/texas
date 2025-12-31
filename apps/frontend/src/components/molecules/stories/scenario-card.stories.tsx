import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import ScenarioCard from '../scenario-card';
import {
  ScenarioResponseDto,
  ScenarioResponseDtoActionTypeEnum,
  ScenarioResponseDtoBoardTextureEnum,
  ScenarioResponseDtoDifficultyEnum,
  ScenarioResponseDtoCategoryEnum,
  ScenarioResponseDtoGameTypeEnum,
  ScenarioResponseDtoPositionEnum,
  ScenarioResponseDtoStreetEnum,
  ScenarioResponseDtoVsPositionEnum,
} from '../../../../backend-api/api';

const meta: Meta<typeof ScenarioCard> = {
  title: 'Molecules/ScenarioCard',
  component: ScenarioCard,
  argTypes: {
    onClick: {
      description: 'Callback when card is clicked',
    },
  },
  args: {
    onClick: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof ScenarioCard>;

const mockScenario: ScenarioResponseDto = {
  _id: '1',
  name: '3-Bet from Button',
  description: 'Defending against 3-bet from button position with various hands',
  street: ScenarioResponseDtoStreetEnum.Preflop,
  gameType: ScenarioResponseDtoGameTypeEnum.Cash,
  difficulty: ScenarioResponseDtoDifficultyEnum.Intermediate,
  category: ScenarioResponseDtoCategoryEnum._3Betting,
  position: ScenarioResponseDtoPositionEnum.Co,
  vsPosition: ScenarioResponseDtoVsPositionEnum.Btn,
  actionType: ScenarioResponseDtoActionTypeEnum.Vs3bet,
  effectiveStack: 100,
  betSize: 22,
  tags: ['preflop', '3-bet', 'in-position'],
  createdAt: new Date('2025-01-01T00:00:00.000Z').toISOString(),
  updatedAt: new Date('2025-01-01T00:00:00.000Z').toISOString(),
};

export const Default: Story = {
  args: {
    scenario: mockScenario,
  },
};

export const BeginnerScenario: Story = {
  args: {
    scenario: {
      ...mockScenario,
      _id: '2',
      name: 'Button Open Raise',
      description: 'Basic button opening ranges in unopened pots',
      difficulty: ScenarioResponseDtoDifficultyEnum.Beginner,
      category: ScenarioResponseDtoCategoryEnum.OpeningRanges,
      position: ScenarioResponseDtoPositionEnum.Btn,
      vsPosition: ScenarioResponseDtoVsPositionEnum.Bb,
      actionType: ScenarioResponseDtoActionTypeEnum.Open,
      effectiveStack: 100,
      betSize: 2.5,
      tags: ['preflop', 'open'],
    },
  },
};

export const AdvancedScenario: Story = {
  args: {
    scenario: {
      ...mockScenario,
      _id: '3',
      name: '4-Bet vs CO 3-Bet',
      description: 'Advanced 4-betting strategy against CO 3-bets with polarized range',
      difficulty: ScenarioResponseDtoDifficultyEnum.Advanced,
      category: ScenarioResponseDtoCategoryEnum._3Betting,
      position: ScenarioResponseDtoPositionEnum.Btn,
      vsPosition: ScenarioResponseDtoVsPositionEnum.Co,
      actionType: ScenarioResponseDtoActionTypeEnum.Vs4bet,
      effectiveStack: 100,
      betSize: 45,
      tags: ['preflop', '4-bet'],
    },
  },
};

export const PostflopScenario: Story = {
  args: {
    scenario: {
      ...mockScenario,
      _id: '4',
      name: 'CB on A-high Board',
      description: 'Continuation betting strategy on ace-high boards as preflop aggressor',
      difficulty: ScenarioResponseDtoDifficultyEnum.Intermediate,
      category: ScenarioResponseDtoCategoryEnum.CallingRanges,
      street: ScenarioResponseDtoStreetEnum.Flop,
      position: ScenarioResponseDtoPositionEnum.Btn,
      vsPosition: ScenarioResponseDtoVsPositionEnum.Bb,
      actionType: ScenarioResponseDtoActionTypeEnum.Cbet,
      effectiveStack: 100,
      betSize: 6.5,
      boardCards: 'As Kh 7d',
      boardTexture: ScenarioResponseDtoBoardTextureEnum.Dry,
      tags: ['postflop', 'cbet'],
    },
  },
};
