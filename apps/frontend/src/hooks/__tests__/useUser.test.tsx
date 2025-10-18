import { renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import useUser from '../useUser';
import userReducer, { login, clearState } from '../../store/slices/user-slice';
import { mockUser } from '../../utils/test-utils';
import { FetchStatus } from '../../constants';
import { server } from '../../msw/server';
import { authErrorHandlers } from '../../msw/handlers';

// Helper to create test store
const createTestStore = () => {
  return configureStore({
    reducer: {
      user: userReducer,
    },
  });
};

// Wrapper component for hook testing
const createWrapper = (store: ReturnType<typeof createTestStore>) => {
  return ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
};

describe('useUser', () => {
  it('should return dispatch and userState', () => {
    const store = createTestStore();
    const { result } = renderHook(() => useUser(), {
      wrapper: createWrapper(store),
    });

    const [dispatch, userState] = result.current;

    expect(typeof dispatch).toBe('function');
    expect(userState).toEqual({
      status: FetchStatus.IDDLE,
      user: undefined,
      error: null,
      resendVerificationStatus: FetchStatus.IDDLE,
      resendVerificationError: null,
      resetPasswordStatus: FetchStatus.IDDLE,
      resetPasswordError: null,
    });
  });

  it('should update userState when store changes', async () => {
    const store = createTestStore();
    const { result } = renderHook(() => useUser(), {
      wrapper: createWrapper(store),
    });

    const [dispatch] = result.current;

    // Dispatch action to login
    dispatch(login({ username: 'testuser', password: 'password123' }));

    await waitFor(() => {
      const [, userState] = result.current;
      expect(userState.status).toBe(FetchStatus.SUCCEDED);
      expect(userState.user).toEqual(mockUser);
    });
  });

  it('should clear state on unmount', () => {
    const store = createTestStore();

    // Populate store with data
    store.dispatch(login({ username: 'testuser', password: 'password123' }));

    const { unmount } = renderHook(() => useUser(), {
      wrapper: createWrapper(store),
    });

    // Unmount the hook
    unmount();

    // Check that clearState was called
    const state = store.getState().user;
    expect(state.status).toBe(FetchStatus.IDDLE);
    expect(state.error).toBeNull();
  });

  it('should allow dispatching user actions', async () => {
    const store = createTestStore();
    const { result } = renderHook(() => useUser(), {
      wrapper: createWrapper(store),
    });

    const [dispatch] = result.current;

    // Dispatch login
    await dispatch(login({ username: 'testuser', password: 'password123' }));

    await waitFor(() => {
      const [, userState] = result.current;
      expect(userState.user).toEqual(mockUser);
      expect(userState.status).toBe(FetchStatus.SUCCEDED);
    });
  });

  it('should handle errors in user state', async () => {
    server.use(authErrorHandlers.loginError);
    const store = createTestStore();
    const { result } = renderHook(() => useUser(), {
      wrapper: createWrapper(store),
    });

    const [dispatch] = result.current;

    // Dispatch action that will fail (wrong credentials)
    await dispatch(login({ username: 'wronguser', password: 'wrongpass' }));

    await waitFor(() => {
      const [, userState] = result.current;
      expect(userState.status).toBe(FetchStatus.FAILED);
      expect(userState.error).toBeTruthy();
    });
  });

  it('should track resendVerificationStatus separately', () => {
    const store = createTestStore();
    const { result } = renderHook(() => useUser(), {
      wrapper: createWrapper(store),
    });

    const [, userState] = result.current;

    expect(userState.resendVerificationStatus).toBe(FetchStatus.IDDLE);
    expect(userState.resendVerificationError).toBeNull();
  });

  it('should track resetPasswordStatus separately', () => {
    const store = createTestStore();
    const { result } = renderHook(() => useUser(), {
      wrapper: createWrapper(store),
    });

    const [, userState] = result.current;

    expect(userState.resetPasswordStatus).toBe(FetchStatus.IDDLE);
    expect(userState.resetPasswordError).toBeNull();
  });
});
