// Redux
import { configureStore } from '@reduxjs/toolkit';

// Slice
import userReducer, {
  login,
  logout,
  signup,
  reset,
  newPassword,
  validate,
  resendVerification,
  setUser,
  clearState,
  selectUser,
  selectAuthenticatedUser,
  UserState,
} from '../user-slice';

// MSW
import { server } from '../../../msw/server';
import { authErrorHandlers, userErrorHandlers } from '../../../msw/handlers';

// Constants
import { FetchStatus } from '../../../constants';

// Test utils
import { mockUser } from '../../../utils/test-utils';

// Helper to create test store
const createTestStore = (preloadedState?: { user: UserState }) => {
  return configureStore({
    reducer: {
      user: userReducer,
    },
    preloadedState,
  });
};

describe('user-slice', () => {
  describe('reducers', () => {
    it('should return initial state', () => {
      const state = userReducer(undefined, { type: '@@INIT' });
      expect(state).toEqual({
        status: FetchStatus.IDDLE,
        user: undefined,
        error: null,
        resendVerificationStatus: FetchStatus.IDDLE,
        resendVerificationError: null,
        resetPasswordStatus: FetchStatus.IDDLE,
        resetPasswordError: null,
      });
    });

    it('should handle setUser', () => {
      const initialState = {
        status: FetchStatus.IDDLE,
        user: undefined,
        error: null,
        resendVerificationStatus: FetchStatus.IDDLE,
        resendVerificationError: null,
        resetPasswordStatus: FetchStatus.IDDLE,
        resetPasswordError: null,
      };

      const state = userReducer(initialState, setUser(mockUser));
      expect(state.user).toEqual(mockUser);
    });

    it('should handle clearState', () => {
      const initialState = {
        status: FetchStatus.FAILED,
        user: mockUser,
        error: 'Some error',
        resendVerificationStatus: FetchStatus.IDDLE,
        resendVerificationError: null,
        resetPasswordStatus: FetchStatus.IDDLE,
        resetPasswordError: null,
      };

      const state = userReducer(initialState, clearState());
      expect(state.status).toBe(FetchStatus.IDDLE);
      expect(state.error).toBeNull();
      // Should keep user
      expect(state.user).toEqual(mockUser);
    });
  });

  describe('selectors', () => {
    it('should select user state', () => {
      const store = createTestStore();

      const userState = selectUser(store.getState() as any);
      expect(userState.status).toBe(FetchStatus.IDDLE);
      expect(userState.user).toBeUndefined();
    });

    it('should select authenticated user', () => {
      const store = createTestStore({
        user: {
          status: FetchStatus.SUCCEDED,
          user: mockUser,
          error: null,
          resendVerificationStatus: FetchStatus.IDDLE,
          resendVerificationError: null,
          resetPasswordStatus: FetchStatus.IDDLE,
          resetPasswordError: null,
        },
      });

      const user = selectAuthenticatedUser(store.getState() as any);
      expect(user).toEqual(mockUser);
    });

    it('should throw error when selecting authenticated user without user', () => {
      const store = createTestStore();

      expect(() => selectAuthenticatedUser(store.getState() as any)).toThrow(
        'User must be authenticated to access this resource',
      );
    });
  });

  describe('async thunks', () => {
    describe('login', () => {
      it('should login successfully', async () => {
        const store = createTestStore();

        await store.dispatch(
          login({
            username: 'testuser',
            password: 'password123',
          }),
        );

        const state = store.getState().user;
        expect(state.status).toBe(FetchStatus.SUCCEDED);
        expect(state.user).toEqual(mockUser);
        expect(state.error).toBeNull();
      });

      it('should handle login error', async () => {
        server.use(authErrorHandlers.loginError);
        const store = createTestStore();

        await store.dispatch(
          login({
            username: 'wronguser',
            password: 'wrongpass',
          }),
        );

        const state = store.getState().user;
        expect(state.status).toBe(FetchStatus.FAILED);
        expect(state.error).toBe('Login error');
      });

      it('should set loading state while logging in', async () => {
        const store = createTestStore();

        const promise = store.dispatch(
          login({
            username: 'testuser',
            password: 'password123',
          }),
        );

        // Check loading state immediately
        const state = store.getState().user;
        expect(state.status).toBe(FetchStatus.LOADING);

        await promise;
      });
    });

    describe('logout', () => {
      it('should logout successfully', async () => {
        const store = createTestStore({
          user: {
            status: FetchStatus.SUCCEDED,
            user: mockUser,
            error: null,
            resendVerificationStatus: FetchStatus.IDDLE,
            resendVerificationError: null,
            resetPasswordStatus: FetchStatus.IDDLE,
            resetPasswordError: null,
          },
        });

        await store.dispatch(logout());

        const state = store.getState().user;
        expect(state.status).toBe(FetchStatus.SUCCEDED);
        expect(state.user).toBeUndefined();
      });
    });

    describe('signup', () => {
      it('should signup successfully', async () => {
        const store = createTestStore();

        await store.dispatch(
          signup({
            username: 'newuser',
            email: 'new@test.com',
            password: 'password123',
          }),
        );

        const state = store.getState().user;
        expect(state.status).toBe(FetchStatus.SUCCEDED);
        expect(state.error).toBeNull();
      });

      it('should handle signup error', async () => {
        server.use(userErrorHandlers.signupDuplicateUsername);
        const store = createTestStore();

        await store.dispatch(
          signup({
            username: 'existinguser',
            email: 'existing@test.com',
            password: 'password123',
          }),
        );

        const state = store.getState().user;
        expect(state.status).toBe(FetchStatus.FAILED);
        expect(state.error).toBe('Sign up error');
      });
    });

    describe('reset (password)', () => {
      it('should send reset email successfully', async () => {
        const store = createTestStore();

        await store.dispatch(reset('test@example.com'));

        const state = store.getState().user;
        expect(state.resetPasswordStatus).toBe(FetchStatus.SUCCEDED);
        expect(state.resetPasswordError).toBeNull();
      });

      it('should handle reset email error', async () => {
        server.use(authErrorHandlers.resetPasswordError);
        const store = createTestStore();

        await store.dispatch(reset('invalid@example.com'));

        const state = store.getState().user;
        expect(state.resetPasswordStatus).toBe(FetchStatus.FAILED);
        expect(state.resetPasswordError).toBe('Failed to send email');
      });

      it('should set loading state while sending reset email', async () => {
        const store = createTestStore();

        const promise = store.dispatch(reset('test@example.com'));

        // Check loading state immediately
        const state = store.getState().user;
        expect(state.resetPasswordStatus).toBe(FetchStatus.LOADING);

        await promise;
      });
    });

    describe('newPassword', () => {
      it('should reset password successfully', async () => {
        const store = createTestStore();

        await store.dispatch(
          newPassword({
            token: 'valid-token',
            password: 'newpassword123',
          }),
        );

        const state = store.getState().user;
        expect(state.status).toBe(FetchStatus.SUCCEDED);
        expect(state.error).toBeNull();
      });

      it('should handle invalid token', async () => {
        server.use(userErrorHandlers.resetPasswordInvalidToken);
        const store = createTestStore();

        await store.dispatch(
          newPassword({
            token: 'invalid-token',
            password: 'newpassword123',
          }),
        );

        const state = store.getState().user;
        expect(state.status).toBe(FetchStatus.FAILED);
        expect(state.error).toBe('Server error');
      });

      it('should reject when no token provided', async () => {
        const store = createTestStore();

        await store.dispatch(
          newPassword({
            token: '',
            password: 'newpassword123',
          }),
        );

        const state = store.getState().user;
        expect(state.status).toBe(FetchStatus.FAILED);
        expect(state.error).toBe('No token provided');
      });
    });

    describe('validate', () => {
      it('should validate email successfully', async () => {
        const store = createTestStore();

        await store.dispatch(validate('valid-token'));

        const state = store.getState().user;
        expect(state.status).toBe(FetchStatus.SUCCEDED);
        expect(state.error).toBeNull();
      });

      it('should reject when no token provided', async () => {
        const store = createTestStore();

        await store.dispatch(validate(''));

        const state = store.getState().user;
        expect(state.status).toBe(FetchStatus.FAILED);
        expect(state.error).toBe('No token provided');
      });
    });

    describe('resendVerification', () => {
      it('should resend verification email successfully', async () => {
        const store = createTestStore();

        await store.dispatch(resendVerification('test@example.com'));

        const state = store.getState().user;
        expect(state.resendVerificationStatus).toBe(FetchStatus.SUCCEDED);
        expect(state.resendVerificationError).toBeNull();
      });

      it('should set loading state while resending', async () => {
        const store = createTestStore();

        const promise = store.dispatch(resendVerification('test@example.com'));

        // Check loading state immediately
        const state = store.getState().user;
        expect(state.resendVerificationStatus).toBe(FetchStatus.LOADING);

        await promise;
      });
    });

    // Note: refresh thunk exists but is not handled in extraReducers
    // It's used by interceptors for automatic token refresh
  });
});
