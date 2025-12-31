import { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import ScenarioList from '../scenario-list';
import scenarioReducer from '../../../store/slices/scenario-slice';
import { FetchStatus } from '../../../constants';
import {
  ScenarioResponseDto,
  ScenarioResponseDtoActionTypeEnum,
  ScenarioResponseDtoDifficultyEnum,
  ScenarioResponseDtoCategoryEnum,
  ScenarioResponseDtoStreetEnum,
  ScenarioResponseDtoPositionEnum,
  ScenarioResponseDtoGameTypeEnum,
  ScenarioResponseDtoVsPositionEnum,
} from '../../../../backend-api/api';

// Mock scenarios
const mockScenarios: ScenarioResponseDto[] = [
  {
    _id: '1',
    name: '3-Bet from Button',
    description: 'Defending against 3-bet from button position',
    street: ScenarioResponseDtoStreetEnum.Preflop,
    difficulty: ScenarioResponseDtoDifficultyEnum.Intermediate,
    category: ScenarioResponseDtoCategoryEnum._3Betting,
    gameType: ScenarioResponseDtoGameTypeEnum.Cash,
    position: ScenarioResponseDtoPositionEnum.Co,
    vsPosition: ScenarioResponseDtoVsPositionEnum.Btn,
    actionType: ScenarioResponseDtoActionTypeEnum.Vs3bet,
    effectiveStack: 100,
    betSize: 22,
    tags: ['preflop', '3-bet'],
    createdAt: new Date('2025-01-01T00:00:00.000Z').toISOString(),
    updatedAt: new Date('2025-01-01T00:00:00.000Z').toISOString(),
  },
  {
    _id: '2',
    name: 'Button Open Raise',
    description: 'Basic button opening ranges',
    street: ScenarioResponseDtoStreetEnum.Preflop,
    difficulty: ScenarioResponseDtoDifficultyEnum.Beginner,
    category: ScenarioResponseDtoCategoryEnum.OpeningRanges,
    gameType: ScenarioResponseDtoGameTypeEnum.Cash,
    position: ScenarioResponseDtoPositionEnum.Btn,
    vsPosition: ScenarioResponseDtoVsPositionEnum.Bb,
    actionType: ScenarioResponseDtoActionTypeEnum.Open,
    effectiveStack: 100,
    betSize: 2.5,
    tags: ['preflop', 'open'],
    createdAt: new Date('2025-01-01T00:00:00.000Z').toISOString(),
    updatedAt: new Date('2025-01-01T00:00:00.000Z').toISOString(),
  },
];

const meta: Meta<typeof ScenarioList> = {
  title: 'Organisms/ScenarioList',
  component: ScenarioList,
  decorators: [
    (Story) => {
      const store = configureStore({
        reducer: {
          scenario: scenarioReducer,
        },
        preloadedState: {
          scenario: {
            scenarios: mockScenarios,
            currentScenario: null,
            status: FetchStatus.SUCCEDED,
            error: null,
          },
        },
      });

      return (
        <Provider store={store}>
          <BrowserRouter>
            <Story />
          </BrowserRouter>
        </Provider>
      );
    },
  ],
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj<typeof ScenarioList>;

export const Default: Story = {};

export const Loading: Story = {
  decorators: [
    (Story) => {
      const store = configureStore({
        reducer: {
          scenario: scenarioReducer,
        },
        preloadedState: {
          scenario: {
            scenarios: [],
            currentScenario: null,
            status: FetchStatus.LOADING,
            error: null,
          },
        },
      });

      return (
        <Provider store={store}>
          <BrowserRouter>
            <Story />
          </BrowserRouter>
        </Provider>
      );
    },
  ],
};

export const Error: Story = {
  decorators: [
    (Story) => {
      const store = configureStore({
        reducer: {
          scenario: scenarioReducer,
        },
        preloadedState: {
          scenario: {
            scenarios: [],
            currentScenario: null,
            status: FetchStatus.FAILED,
            error: 'Failed to load scenarios',
          },
        },
      });

      return (
        <Provider store={store}>
          <BrowserRouter>
            <Story />
          </BrowserRouter>
        </Provider>
      );
    },
  ],
};
