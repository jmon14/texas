// Redux
import { configureStore } from '@reduxjs/toolkit';

// Slice
import scenarioReducer, {
  fetchScenarios,
  fetchScenarioById,
  fetchScenariosByCategory,
  setCurrentScenario,
  clearState,
  selectScenario,
  ScenarioState,
} from '../scenario-slice';

// MSW
import { server } from '../../../msw/server';
import { scenarioErrorHandlers, mockScenarios } from '../../../msw/handlers';

// Constants
import { FetchStatus } from '../../../constants';

// Helper to create test store
const createTestStore = (preloadedState?: { scenario: ScenarioState }) => {
  return configureStore({
    reducer: {
      scenario: scenarioReducer,
    },
    preloadedState,
  });
};

describe('scenario-slice', () => {
  describe('reducers', () => {
    it('should return initial state', () => {
      const state = scenarioReducer(undefined, { type: '@@INIT' });
      expect(state).toEqual({
        status: FetchStatus.IDDLE,
        currentScenario: null,
        error: null,
        scenarios: [],
      });
    });

    it('should handle setCurrentScenario', () => {
      const initialState = {
        status: FetchStatus.IDDLE,
        currentScenario: null,
        error: null,
        scenarios: [],
      };

      const state = scenarioReducer(initialState, setCurrentScenario(mockScenarios[0]));
      expect(state.currentScenario).toEqual(mockScenarios[0]);
    });

    it('should handle clearState', () => {
      const initialState = {
        status: FetchStatus.FAILED,
        currentScenario: mockScenarios[0],
        error: 'Some error',
        scenarios: mockScenarios,
      };

      const state = scenarioReducer(initialState, clearState());
      expect(state.status).toBe(FetchStatus.IDDLE);
      expect(state.error).toBeNull();
      // Should keep currentScenario and scenarios
      expect(state.currentScenario).toEqual(mockScenarios[0]);
      expect(state.scenarios).toEqual(mockScenarios);
    });
  });

  describe('selectors', () => {
    it('should select scenario state', () => {
      const store = createTestStore();

      const scenarioState = selectScenario(store.getState() as any);
      expect(scenarioState.status).toBe(FetchStatus.IDDLE);
      expect(scenarioState.currentScenario).toBeNull();
      expect(scenarioState.scenarios).toEqual([]);
    });
  });

  describe('async thunks', () => {
    describe('fetchScenarios', () => {
      it('should fetch scenarios successfully', async () => {
        const store = createTestStore();

        await store.dispatch(fetchScenarios({}));

        const state = store.getState().scenario;
        expect(state.status).toBe(FetchStatus.SUCCEDED);
        expect(state.scenarios).toEqual(mockScenarios);
        expect(state.error).toBeNull();
      });

      it('should handle fetch error', async () => {
        server.use(scenarioErrorHandlers.getScenariosError);
        const store = createTestStore();

        await store.dispatch(fetchScenarios({}));

        const state = store.getState().scenario;
        expect(state.status).toBe(FetchStatus.FAILED);
        expect(state.error).toBeTruthy();
      });

      it('should set loading state while fetching', async () => {
        const store = createTestStore();

        const promise = store.dispatch(fetchScenarios({}));

        // Check loading state immediately
        const state = store.getState().scenario;
        expect(state.status).toBe(FetchStatus.LOADING);

        await promise;
      });
    });

    describe('fetchScenarioById', () => {
      it('should fetch scenario by id successfully', async () => {
        const store = createTestStore();

        await store.dispatch(fetchScenarioById('507f1f77bcf86cd799439011'));

        const state = store.getState().scenario;
        expect(state.status).toBe(FetchStatus.SUCCEDED);
        expect(state.currentScenario).toEqual(mockScenarios[0]);
        expect(state.error).toBeNull();
      });

      it('should handle scenario not found', async () => {
        server.use(scenarioErrorHandlers.getScenarioNotFound);
        const store = createTestStore();

        await store.dispatch(fetchScenarioById('nonexistent-id'));

        const state = store.getState().scenario;
        expect(state.status).toBe(FetchStatus.FAILED);
        expect(state.error).toBeTruthy();
      });
    });

    describe('fetchScenariosByCategory', () => {
      it('should fetch scenarios by category successfully', async () => {
        const store = createTestStore();

        await store.dispatch(fetchScenariosByCategory('Opening Ranges'));

        const state = store.getState().scenario;
        expect(state.status).toBe(FetchStatus.SUCCEDED);
        expect(state.scenarios).toBeTruthy();
        expect(state.error).toBeNull();
      });

      it('should handle fetch by category error', async () => {
        server.use(scenarioErrorHandlers.getScenariosByCategoryError);
        const store = createTestStore();

        await store.dispatch(fetchScenariosByCategory('Opening Ranges'));

        const state = store.getState().scenario;
        expect(state.status).toBe(FetchStatus.FAILED);
        expect(state.error).toBeTruthy();
      });
    });
  });
});
