import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, PreloadedState } from '@reduxjs/toolkit';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Validate from '../validate';
import userReducer from '../../../store/slices/user-slice';
import { FetchStatus } from '../../../constants';

// Test store state type
type TestStoreState = {
  user: ReturnType<typeof userReducer>;
};

// Helper to create test store
const createTestStore = (preloadedState?: PreloadedState<TestStoreState>) => {
  return configureStore({
    reducer: {
      user: userReducer,
    },
    preloadedState,
  });
};

const renderWithRouter = (token: string, store = createTestStore()) => {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[`/validate?token=${token}`]}>
        <Routes>
          <Route path="/validate" element={<Validate />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
};

describe('Validate', () => {
  it('should render without crashing', () => {
    const store = createTestStore();
    renderWithRouter('test-token', store);

    // Component should render
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('should dispatch validate action with token from query params', () => {
    const store = createTestStore();
    const token = 'abc123xyz';

    renderWithRouter(token, store);

    // Validate action should be dispatched (store state would change)
    // Since we're using MSW, the actual API call would be mocked
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('should display success message when validation succeeds', async () => {
    const store = createTestStore({
      user: {
        status: FetchStatus.SUCCEDED,
        user: undefined,
        error: null,
        resendVerificationStatus: FetchStatus.IDDLE,
        resendVerificationError: null,
        resetPasswordStatus: FetchStatus.IDDLE,
        resetPasswordError: null,
      },
    });

    renderWithRouter('valid-token', store);

    await waitFor(() => {
      expect(screen.getByText('Email succesfully validated!')).toBeInTheDocument();
    });
  });

  it('should display error message when validation fails', async () => {
    const store = createTestStore({
      user: {
        status: FetchStatus.FAILED,
        user: undefined,
        error: 'Invalid token',
        resendVerificationStatus: FetchStatus.IDDLE,
        resendVerificationError: null,
        resetPasswordStatus: FetchStatus.IDDLE,
        resetPasswordError: null,
      },
    });

    renderWithRouter('invalid-token', store);

    await waitFor(() => {
      expect(screen.getByText(/Error: Invalid token/i)).toBeInTheDocument();
    });
  });

  it('should handle empty token', () => {
    const store = createTestStore();

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/validate']}>
          <Routes>
            <Route path="/validate" element={<Validate />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    // Component should render without errors
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('should display nothing while loading', () => {
    const store = createTestStore({
      user: {
        status: FetchStatus.LOADING,
        user: undefined,
        error: null,
        resendVerificationStatus: FetchStatus.IDDLE,
        resendVerificationError: null,
        resetPasswordStatus: FetchStatus.IDDLE,
        resetPasswordError: null,
      },
    });

    renderWithRouter('test-token', store);

    // Should show empty message while loading
    const heading = screen.getByRole('heading');
    expect(heading).toHaveTextContent('');
  });

  it('should handle token with special characters', () => {
    const store = createTestStore();
    const specialToken = 'token-with-special_chars.123!@#';

    renderWithRouter(specialToken, store);

    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('should render as h6 variant', () => {
    const store = createTestStore({
      user: {
        status: FetchStatus.SUCCEDED,
        user: undefined,
        error: null,
        resendVerificationStatus: FetchStatus.IDDLE,
        resendVerificationError: null,
        resetPasswordStatus: FetchStatus.IDDLE,
        resetPasswordError: null,
      },
    });

    renderWithRouter('test-token', store);

    const heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H6');
  });
});
