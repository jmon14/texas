// Slice
import rangeReducer, {
  createRange,
  getRangeById,
  updateRange,
  deleteRange,
  getRangesByUserId,
  setCurrentRange,
  clearState,
  selectRange,
  RangeState,
} from '../range-slice';

// Store
import { setupStore } from '../../store';

// MSW
import { server } from '../../../msw/server';
import { rangeErrorHandlers, mockRange, mockRanges } from '../../../msw/handlers';

// Constants
import { FetchStatus } from '../../../constants';

// Helper to create test store
const createTestStore = (preloadedState?: { range: RangeState }) => setupStore(preloadedState);

describe('range-slice', () => {
  describe('reducers', () => {
    it('should return initial state', () => {
      const state = rangeReducer(undefined, { type: '@@INIT' });
      expect(state).toEqual({
        status: FetchStatus.IDDLE,
        currentRange: null,
        error: null,
        ranges: [],
      });
    });

    it('should handle setCurrentRange', () => {
      const initialState = {
        status: FetchStatus.IDDLE,
        currentRange: null,
        error: null,
        ranges: [],
      };

      const state = rangeReducer(initialState, setCurrentRange(mockRange));
      expect(state.currentRange).toEqual(mockRange);
    });

    it('should handle clearState', () => {
      const initialState = {
        status: FetchStatus.FAILED,
        currentRange: mockRange,
        error: 'Some error',
        ranges: mockRanges,
      };

      const state = rangeReducer(initialState, clearState());
      expect(state.status).toBe(FetchStatus.IDDLE);
      expect(state.error).toBeNull();
      // Should keep currentRange and ranges
      expect(state.currentRange).toEqual(mockRange);
      expect(state.ranges).toEqual(mockRanges);
    });
  });

  describe('selectors', () => {
    it('should select range state', () => {
      const store = createTestStore();

      const rangeState = selectRange(store.getState());
      expect(rangeState.status).toBe(FetchStatus.IDDLE);
      expect(rangeState.currentRange).toBeNull();
      expect(rangeState.ranges).toEqual([]);
    });
  });

  describe('async thunks', () => {
    describe('getRangesByUserId', () => {
      it('should fetch ranges successfully', async () => {
        const store = createTestStore();

        await store.dispatch(getRangesByUserId('user-123'));

        const state = store.getState().range;
        expect(state.status).toBe(FetchStatus.SUCCEDED);
        expect(state.ranges).toEqual(mockRanges);
        expect(state.error).toBeNull();
      });

      it('should handle fetch error', async () => {
        server.use(rangeErrorHandlers.getRangesError);
        const store = createTestStore();

        await store.dispatch(getRangesByUserId('user-123'));

        const state = store.getState().range;
        expect(state.status).toBe(FetchStatus.FAILED);
        expect(state.error).toBe('Failed to fetch ranges');
      });

      it('should set loading state while fetching', async () => {
        const store = createTestStore();

        const promise = store.dispatch(getRangesByUserId('user-123'));

        // Check loading state immediately
        const state = store.getState().range;
        expect(state.status).toBe(FetchStatus.LOADING);

        await promise;
      });
    });

    describe('getRangeById', () => {
      it('should fetch range by id successfully', async () => {
        const store = createTestStore();

        await store.dispatch(getRangeById('507f1f77bcf86cd799439011'));

        const state = store.getState().range;
        expect(state.status).toBe(FetchStatus.SUCCEDED);
        expect(state.currentRange).toEqual(mockRange);
        expect(state.error).toBeNull();
      });

      it('should handle range not found', async () => {
        server.use(rangeErrorHandlers.getRangeNotFound);
        const store = createTestStore();

        await store.dispatch(getRangeById('nonexistent-id'));

        const state = store.getState().range;
        expect(state.status).toBe(FetchStatus.FAILED);
        expect(state.error).toBe('Range not found');
      });
    });

    describe('createRange', () => {
      it('should create range successfully', async () => {
        const store = createTestStore();

        const newRange = {
          name: 'New Test Range',
          userId: 'user-123',
          handsRange: [
            {
              carryoverFrequency: 40,
              label: 'FOLD',
              actions: [{ type: 'FOLD' as any, frequency: 40 }],
            },
          ],
        };

        await store.dispatch(createRange(newRange));

        const state = store.getState().range;
        expect(state.status).toBe(FetchStatus.SUCCEDED);
        expect(state.ranges).toEqual(mockRanges); // MSW returns mockRanges from getRangesByUserId
        expect(state.error).toBeNull();
      });

      it('should handle validation error', async () => {
        server.use(rangeErrorHandlers.createRangeValidationError);
        const store = createTestStore();

        await store.dispatch(
          createRange({
            name: '',
            userId: 'user-123',
            handsRange: [],
          }),
        );

        const state = store.getState().range;
        expect(state.status).toBe(FetchStatus.FAILED);
        expect(state.error).toBe('Validation failed: name is required');
      });

      it('should handle range limit exceeded', async () => {
        server.use(rangeErrorHandlers.createRangeLimitExceeded);
        const store = createTestStore();

        await store.dispatch(
          createRange({
            name: 'Range 11',
            userId: 'user-123',
            handsRange: [],
          }),
        );

        const state = store.getState().range;
        expect(state.status).toBe(FetchStatus.FAILED);
        expect(state.error).toBe('Range limit exceeded. Maximum 10 ranges allowed.');
      });
    });

    describe('updateRange', () => {
      it('should update range successfully', async () => {
        const store = createTestStore();

        await store.dispatch(
          updateRange({
            id: '507f1f77bcf86cd799439011',
            range: {
              name: 'Updated Range',
              handsRange: mockRange.handsRange,
            },
            userId: 'user-123',
          }),
        );

        const state = store.getState().range;
        expect(state.status).toBe(FetchStatus.SUCCEDED);
        expect(state.ranges).toEqual(mockRanges);
        expect(state.error).toBeNull();
      });

      it('should handle update error', async () => {
        server.use(rangeErrorHandlers.updateRangeNotFound);
        const store = createTestStore();

        await store.dispatch(
          updateRange({
            id: 'nonexistent-id',
            range: {
              name: 'Updated Range',
              userId: 'user-123',
              handsRange: [],
            },
            userId: 'user-123',
          }),
        );

        const state = store.getState().range;
        expect(state.status).toBe(FetchStatus.FAILED);
        // Error message varies based on network/404 response
        expect(state.error).toBeTruthy();
      });
    });

    describe('deleteRange', () => {
      it('should delete range successfully', async () => {
        const store = createTestStore();

        await store.dispatch(
          deleteRange({
            id: '507f1f77bcf86cd799439011',
            userId: 'user-123',
          }),
        );

        const state = store.getState().range;
        expect(state.status).toBe(FetchStatus.SUCCEDED);
        expect(state.ranges).toEqual(mockRanges);
        expect(state.error).toBeNull();
      });

      it('should handle delete error', async () => {
        server.use(rangeErrorHandlers.deleteRangeError);
        const store = createTestStore();

        await store.dispatch(
          deleteRange({
            id: '507f1f77bcf86cd799439011',
            userId: 'user-123',
          }),
        );

        const state = store.getState().range;
        expect(state.status).toBe(FetchStatus.FAILED);
        expect(state.error).toBe('Failed to delete range');
      });

      it('should handle range not found', async () => {
        server.use(rangeErrorHandlers.deleteRangeNotFound);
        const store = createTestStore();

        await store.dispatch(
          deleteRange({
            id: 'nonexistent-id',
            userId: 'user-123',
          }),
        );

        const state = store.getState().range;
        expect(state.status).toBe(FetchStatus.FAILED);
        expect(state.error).toBe('Range not found');
      });
    });
  });
});
