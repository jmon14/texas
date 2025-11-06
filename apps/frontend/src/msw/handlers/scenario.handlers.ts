// External libraries
import { http, HttpResponse } from 'msw';

// Interfaces
import {
  ScenarioResponseDto,
  ScenarioResponseDtoPositionEnum,
  ScenarioResponseDtoGameTypeEnum,
  ScenarioResponseDtoDifficultyEnum,
  ScenarioResponseDtoCategoryEnum,
  ScenarioResponseDtoStreetEnum,
  ScenarioResponseDtoActionTypeEnum,
  PreviousActionDto,
  PreviousActionDtoPositionEnum,
  PreviousActionDtoActionTypeEnum,
} from '../../../backend-api/api';

// Mock data - Sample scenarios matching backend schema
const mockScenarios: ScenarioResponseDto[] = [
  {
    _id: '507f1f77bcf86cd799439011',
    name: 'UTG Open - 100bb Tournament',
    description: "You're UTG in a 100bb tournament. What should your opening range be?",
    street: ScenarioResponseDtoStreetEnum.Preflop,
    gameType: ScenarioResponseDtoGameTypeEnum.Tournament,
    position: ScenarioResponseDtoPositionEnum.Utg,
    vsPosition: ScenarioResponseDtoPositionEnum.Bb,
    actionType: ScenarioResponseDtoActionTypeEnum.Open,
    effectiveStack: 100,
    betSize: 2.0,
    difficulty: ScenarioResponseDtoDifficultyEnum.Beginner,
    category: ScenarioResponseDtoCategoryEnum.OpeningRanges,
    tags: ['tournament', '6max', 'preflop', 'opening'],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    _id: '507f1f77bcf86cd799439012',
    name: 'BTN vs CO Open - Call Range',
    description: 'CO opens 2bb at 100bb effective. You are on BTN. Build your calling range.',
    street: ScenarioResponseDtoStreetEnum.Preflop,
    gameType: ScenarioResponseDtoGameTypeEnum.Tournament,
    position: ScenarioResponseDtoPositionEnum.Btn,
    vsPosition: ScenarioResponseDtoPositionEnum.Co,
    actionType: ScenarioResponseDtoActionTypeEnum.VsOpenCall,
    effectiveStack: 100,
    betSize: 2.0,
    previousActions: [
      {
        position: PreviousActionDtoPositionEnum.Utg,
        actionType: PreviousActionDtoActionTypeEnum.Fold,
        sizing: undefined,
      },
      {
        position: PreviousActionDtoPositionEnum.Mp,
        actionType: PreviousActionDtoActionTypeEnum.Fold,
        sizing: undefined,
      },
      {
        position: PreviousActionDtoPositionEnum.Co,
        actionType: PreviousActionDtoActionTypeEnum.Raise,
        sizing: 2.0,
      },
    ] as PreviousActionDto[],
    difficulty: ScenarioResponseDtoDifficultyEnum.Intermediate,
    category: ScenarioResponseDtoCategoryEnum.CallingRanges,
    tags: ['tournament', '6max', 'preflop', 'calling'],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    _id: '507f1f77bcf86cd799439013',
    name: 'BTN vs CO Open - 3-Bet Range',
    description: 'CO opens 2bb at 100bb effective. You are on BTN. Build your 3-betting range.',
    street: ScenarioResponseDtoStreetEnum.Preflop,
    gameType: ScenarioResponseDtoGameTypeEnum.Tournament,
    position: ScenarioResponseDtoPositionEnum.Btn,
    vsPosition: ScenarioResponseDtoPositionEnum.Co,
    actionType: ScenarioResponseDtoActionTypeEnum.VsOpen3bet,
    effectiveStack: 100,
    betSize: 2.0,
    previousActions: [
      {
        position: PreviousActionDtoPositionEnum.Utg,
        actionType: PreviousActionDtoActionTypeEnum.Fold,
        sizing: undefined,
      },
      {
        position: PreviousActionDtoPositionEnum.Mp,
        actionType: PreviousActionDtoActionTypeEnum.Fold,
        sizing: undefined,
      },
      {
        position: PreviousActionDtoPositionEnum.Co,
        actionType: PreviousActionDtoActionTypeEnum.Raise,
        sizing: 2.0,
      },
    ] as PreviousActionDto[],
    difficulty: ScenarioResponseDtoDifficultyEnum.Intermediate,
    category: ScenarioResponseDtoCategoryEnum._3Betting,
    tags: ['tournament', '6max', 'preflop', '3bet'],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    _id: '507f1f77bcf86cd799439014',
    name: 'BB vs BTN Open - 3-Bet Range',
    description: 'BTN opens 2bb at 100bb effective. You are in BB. Build your 3-betting range.',
    street: ScenarioResponseDtoStreetEnum.Preflop,
    gameType: ScenarioResponseDtoGameTypeEnum.Tournament,
    position: ScenarioResponseDtoPositionEnum.Bb,
    vsPosition: ScenarioResponseDtoPositionEnum.Btn,
    actionType: ScenarioResponseDtoActionTypeEnum.VsOpen3bet,
    effectiveStack: 100,
    betSize: 2.0,
    previousActions: [
      {
        position: PreviousActionDtoPositionEnum.Utg,
        actionType: PreviousActionDtoActionTypeEnum.Fold,
        sizing: undefined,
      },
      {
        position: PreviousActionDtoPositionEnum.Mp,
        actionType: PreviousActionDtoActionTypeEnum.Fold,
        sizing: undefined,
      },
      {
        position: PreviousActionDtoPositionEnum.Co,
        actionType: PreviousActionDtoActionTypeEnum.Fold,
        sizing: undefined,
      },
      {
        position: PreviousActionDtoPositionEnum.Btn,
        actionType: PreviousActionDtoActionTypeEnum.Raise,
        sizing: 2.0,
      },
    ],
    difficulty: ScenarioResponseDtoDifficultyEnum.Advanced,
    category: ScenarioResponseDtoCategoryEnum.DefendingBb,
    tags: ['tournament', '6max', 'preflop', '3bet', 'bb'],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

/**
 * Default scenario handlers - Happy path responses
 */
export const scenarioHandlers = [
  // GET /scenarios - Get all scenarios (with optional filters)
  http.get('http://localhost:3000/scenarios', ({ request }) => {
    const url = new URL(request.url);
    const gameType = url.searchParams.get('gameType') as ScenarioResponseDtoGameTypeEnum | null;
    const difficulty = url.searchParams.get(
      'difficulty',
    ) as ScenarioResponseDtoDifficultyEnum | null;
    const category = url.searchParams.get('category') as ScenarioResponseDtoCategoryEnum | null;

    let filteredScenarios = mockScenarios;

    if (gameType) {
      filteredScenarios = filteredScenarios.filter((s) => s.gameType === gameType);
    }
    if (difficulty) {
      filteredScenarios = filteredScenarios.filter((s) => s.difficulty === difficulty);
    }
    if (category) {
      filteredScenarios = filteredScenarios.filter((s) => s.category === category);
    }

    return HttpResponse.json(filteredScenarios);
  }),

  // GET /scenarios/:id - Get scenario by ID
  http.get('http://localhost:3000/scenarios/:id', ({ params }) => {
    const { id } = params;
    const scenario = mockScenarios.find((s) => s._id === id);
    if (scenario) {
      return HttpResponse.json(scenario);
    }
    return HttpResponse.json({ message: 'Scenario not found' }, { status: 404 });
  }),

  // GET /scenarios/category/:category - Get scenarios by category
  http.get('http://localhost:3000/scenarios/category/:category', ({ params }) => {
    const { category } = params;
    const filteredScenarios = mockScenarios.filter((s) => s.category === category);
    return HttpResponse.json(filteredScenarios);
  }),
];

/**
 * Scenario error handlers for testing failure scenarios
 */
export const scenarioErrorHandlers = {
  // Get scenarios - Server error
  getScenariosError: http.get('http://localhost:3000/scenarios', () => {
    return HttpResponse.json({ message: 'Failed to fetch scenarios' }, { status: 500 });
  }),

  // Get scenario by ID - Not found
  getScenarioNotFound: http.get('http://localhost:3000/scenarios/:id', () => {
    return HttpResponse.json({ message: 'Scenario not found' }, { status: 404 });
  }),

  // Get scenarios by category - Server error
  getScenariosByCategoryError: http.get(
    'http://localhost:3000/scenarios/category/:category',
    () => {
      return HttpResponse.json(
        { message: 'Failed to fetch scenarios by category' },
        { status: 500 },
      );
    },
  ),
};

// Export mock data for use in tests
export { mockScenarios };
