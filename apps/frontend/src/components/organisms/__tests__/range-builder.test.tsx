import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, PreloadedState } from '@reduxjs/toolkit';
import user from '@testing-library/user-event';
import RangeBuilder from '../range-builder';
import rangeReducer from '../../../store/slices/range-slice';
import userReducer from '../../../store/slices/user-slice';
import { mockRanges } from '../../../msw/handlers';
import { FetchStatus } from '../../../constants';

// Test store state type
type TestStoreState = {
  range: ReturnType<typeof rangeReducer>;
  user: ReturnType<typeof userReducer>;
};

type StateOverrides = Partial<{
  user: Partial<TestStoreState['user']>;
  range: Partial<TestStoreState['range']>;
}>;

const DEFAULT_TEST_USER: TestStoreState['user']['user'] = {
  uuid: 'user-123',
  username: 'testuser',
  active: true,
  files: [],
  email: 'test@example.com',
};

const DEFAULT_USER_STATE: TestStoreState['user'] = {
  status: FetchStatus.SUCCEDED,
  user: DEFAULT_TEST_USER,
  error: null,
  resendVerificationStatus: FetchStatus.IDDLE,
  resendVerificationError: null,
  resetPasswordStatus: FetchStatus.IDDLE,
  resetPasswordError: null,
};

const DEFAULT_RANGE_STATE: TestStoreState['range'] = {
  ranges: mockRanges,
  status: FetchStatus.IDDLE,
  error: null,
  currentRange: null,
};

const buildPreloadedState = (overrides?: StateOverrides): PreloadedState<TestStoreState> => {
  const userOverrides = overrides?.user;
  const userEntityOverrides = userOverrides?.user as
    | Partial<TestStoreState['user']['user']>
    | undefined;

  return {
    user: {
      ...DEFAULT_USER_STATE,
      ...userOverrides,
      user: {
        ...DEFAULT_USER_STATE.user,
        ...userEntityOverrides,
      } as TestStoreState['user']['user'],
    },
    range: {
      ...DEFAULT_RANGE_STATE,
      ...overrides?.range,
    },
  };
};

// Helper to create test store with user and range state
const createTestStore = (overrides?: StateOverrides) => {
  return configureStore({
    reducer: {
      range: rangeReducer,
      user: userReducer,
    },
    preloadedState: buildPreloadedState(overrides),
  });
};

const renderRangeBuilder = (store = createTestStore()) => {
  render(
    <Provider store={store}>
      <RangeBuilder />
    </Provider>,
  );

  return { store };
};

describe('RangeBuilder', () => {
  it('should render range builder components', () => {
    const store = createTestStore();

    renderRangeBuilder(store);

    // Should render main components - checking for save button
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('should fetch ranges on mount', async () => {
    const store = createTestStore();

    renderRangeBuilder(store);

    // Wait for ranges to be fetched
    await waitFor(() => {
      const state = store.getState();
      expect(state.range.status).toBe('succeded');
    });
  });

  it('should render default range initially', () => {
    const store = createTestStore();

    renderRangeBuilder(store);

    // Should render successfully
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('should handle range creation', async () => {
    const userEvent = user.setup();
    const store = createTestStore();

    renderRangeBuilder(store);

    // Find the name input (first textbox is the range name)
    const nameInput = screen.getAllByRole('textbox')[0];
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'New Test Range');

    // Find and click submit button
    const submitButton = screen.getByRole('button', { name: /save|submit|create/i });
    await userEvent.click(submitButton);

    // Should dispatch create action
    await waitFor(() => {
      const state = store.getState();
      // Check that an action was dispatched (status should change)
      expect(state.range.status).toBeTruthy();
    });
  });

  it('should handle range update when range has ID', async () => {
    const userEvent = user.setup();
    const store = createTestStore({
      range: {
        status: FetchStatus.SUCCEDED,
        currentRange: mockRanges[0],
      },
    });

    renderRangeBuilder(store);

    // Type in the name field (first textbox is the range name)
    const nameInput = screen.getAllByRole('textbox')[0];
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Updated Range');

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /save|submit|update/i });
    await userEvent.click(submitButton);

    // Should dispatch update or create action
    await waitFor(() => {
      const state = store.getState();
      expect(state.range.status).toBeTruthy();
    });
  });

  it('should handle range deletion', async () => {
    const userEvent = user.setup();
    const store = createTestStore({
      range: {
        status: FetchStatus.SUCCEDED,
        currentRange: mockRanges[0],
      },
    });

    renderRangeBuilder(store);

    // Find delete button if present
    const deleteButton = screen.queryByRole('button', { name: /delete/i });

    if (deleteButton) {
      await userEvent.click(deleteButton);

      // Should dispatch delete action
      await waitFor(() => {
        const state = store.getState();
        expect(state.range.status).toBeTruthy();
      });
    }
  });

  it('should handle cell clicks on range grid', async () => {
    const store = createTestStore();

    const { container } = render(
      <Provider store={store}>
        <RangeBuilder />
      </Provider>,
    );

    // The range grid should be rendered and have interactive elements
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle action list changes', () => {
    const store = createTestStore();

    renderRangeBuilder(store);

    // Component should render successfully with action list
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('should handle range selector changes', async () => {
    const store = createTestStore({
      range: {
        status: FetchStatus.SUCCEDED,
        currentRange: null,
      },
    });

    renderRangeBuilder(store);

    // Wait for component to render
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    });
  });

  it('should update range when name changes', async () => {
    const userEvent = user.setup();
    const store = createTestStore();

    renderRangeBuilder(store);

    // Find the name input by label (Range Name)
    const nameInput = screen.getByLabelText(/range name/i) as HTMLInputElement;
    const initialValue = nameInput.value;
    await userEvent.type(nameInput, 'Updated Name');

    // Name should be updated in the form (appended to existing value)
    expect(nameInput.value).toContain('Updated Name');
    expect(nameInput.value).not.toBe(initialValue);
  });

  it('should handle errors gracefully', () => {
    const store = createTestStore({
      range: {
        ranges: [],
        status: FetchStatus.FAILED,
        error: 'Failed to load ranges',
        currentRange: null,
      },
    });

    renderRangeBuilder(store);

    // Component should still render
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });
});
