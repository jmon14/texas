import { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import ScenarioDetail from '../scenario-detail';
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
  previousActions: [],
  tags: ['preflop', '3-bet'],
  createdAt: new Date('2025-01-01T00:00:00.000Z').toISOString(),
  updatedAt: new Date('2025-01-01T00:00:00.000Z').toISOString(),
};

const meta: Meta<typeof ScenarioDetail> = {
  title: 'Organisms/ScenarioDetail',
  component: ScenarioDetail,
  decorators: [
    (Story) => {
      const store = configureStore({
        reducer: {
          scenario: scenarioReducer,
        },
        preloadedState: {
          scenario: {
            scenarios: [],
            currentScenario: mockScenario,
            status: FetchStatus.SUCCEDED,
            error: null,
          },
        },
      });

      return (
        <Provider store={store}>
          <BrowserRouter>
            <Routes>
              <Route path="*" element={<Story />} />
            </Routes>
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

type Story = StoryObj<typeof ScenarioDetail>;

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
            <Routes>
              <Route path="*" element={<Story />} />
            </Routes>
          </BrowserRouter>
        </Provider>
      );
    },
  ],
};
