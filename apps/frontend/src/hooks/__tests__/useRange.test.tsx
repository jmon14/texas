import { renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import useRange from '../useRange';
import rangeReducer, { getRangesByUserId } from '../../store/slices/range-slice';
import { mockRanges } from '../../msw/handlers';
import { FetchStatus } from '../../constants';

// Helper to create test store
const createTestStore = () => {
  return configureStore({
    reducer: {
      range: rangeReducer,
    },
  });
};

// Wrapper component for hook testing
const createWrapper = (store: ReturnType<typeof createTestStore>) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
  Wrapper.displayName = 'RangeTestWrapper';
  return Wrapper;
};

describe('useRange', () => {
  it('should return dispatch and rangeState', () => {
    const store = createTestStore();
    const { result } = renderHook(() => useRange(), {
      wrapper: createWrapper(store),
    });

    const [dispatch, rangeState] = result.current;

    expect(typeof dispatch).toBe('function');
    expect(rangeState).toEqual({
      status: FetchStatus.IDDLE,
      currentRange: null,
      error: null,
      ranges: [],
    });
  });

  it('should update rangeState when store changes', async () => {
    const store = createTestStore();
    const { result } = renderHook(() => useRange(), {
      wrapper: createWrapper(store),
    });

    const [dispatch] = result.current;

    // Dispatch action to fetch ranges
    dispatch(getRangesByUserId('user-123'));

    await waitFor(() => {
      const [, rangeState] = result.current;
      expect(rangeState.status).toBe(FetchStatus.SUCCEDED);
      expect(rangeState.ranges).toEqual(mockRanges);
    });
  });

  it('should clear state on unmount', () => {
    const store = createTestStore();

    // Populate store with data
    store.dispatch(getRangesByUserId('user-123'));

    const { unmount } = renderHook(() => useRange(), {
      wrapper: createWrapper(store),
    });

    // Unmount the hook
    unmount();

    // Check that clearState was called
    const state = store.getState().range;
    expect(state.status).toBe(FetchStatus.IDDLE);
    expect(state.error).toBeNull();
  });

  it('should allow dispatching range actions', async () => {
    const store = createTestStore();
    const { result } = renderHook(() => useRange(), {
      wrapper: createWrapper(store),
    });

    const [dispatch] = result.current;

    // Dispatch getRangesByUserId
    await dispatch(getRangesByUserId('user-123'));

    await waitFor(() => {
      const [, rangeState] = result.current;
      expect(rangeState.ranges).toHaveLength(mockRanges.length);
      expect(rangeState.status).toBe(FetchStatus.SUCCEDED);
    });
  });

  it('should handle errors in range state', async () => {
    const store = createTestStore();
    const { result } = renderHook(() => useRange(), {
      wrapper: createWrapper(store),
    });

    const [dispatch] = result.current;

    // Dispatch action that will fail (using invalid user id that triggers error handler)
    await dispatch(getRangesByUserId('error-user'));

    await waitFor(() => {
      const [, rangeState] = result.current;
      expect(rangeState.status).toBe(FetchStatus.FAILED);
      expect(rangeState.error).toBeTruthy();
    });
  });
});
