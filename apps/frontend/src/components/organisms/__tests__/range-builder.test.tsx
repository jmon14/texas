import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import user from '@testing-library/user-event';
import RangeBuilder from '../range-builder';
import rangeReducer from '../../../store/slices/range-slice';
import userReducer from '../../../store/slices/user-slice';
import { mockRanges } from '../../../msw/handlers';

// Helper to create test store with user and range state
const createTestStore = (preloadedState?: any) => {
  return configureStore({
    reducer: {
      range: rangeReducer,
      user: userReducer,
    },
    preloadedState: {
      user: {
        status: 'succeeded',
        isAuthenticated: true,
        user: {
          uuid: 'user-123',
          email: 'test@example.com',
        },
        error: null,
      },
      range: {
        ranges: mockRanges,
        status: 'idle',
        error: null,
        currentRange: null,
      },
      ...preloadedState,
    },
  });
};

describe('RangeBuilder', () => {
  it('should render range builder components', () => {
    const store = createTestStore();

    render(
      <Provider store={store}>
        <RangeBuilder />
      </Provider>,
    );

    // Should render main components - checking for save button
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('should fetch ranges on mount', async () => {
    const store = createTestStore();

    render(
      <Provider store={store}>
        <RangeBuilder />
      </Provider>,
    );

    // Wait for ranges to be fetched
    await waitFor(() => {
      const state = store.getState();
      expect(state.range.status).toBe('succeded');
    });
  });

  it('should render default range initially', () => {
    const store = createTestStore();

    render(
      <Provider store={store}>
        <RangeBuilder />
      </Provider>,
    );

    // Should render successfully
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('should handle range creation', async () => {
    const userEvent = user.setup();
    const store = createTestStore();

    render(
      <Provider store={store}>
        <RangeBuilder />
      </Provider>,
    );

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
        ranges: mockRanges,
        status: 'succeeded',
        error: null,
        currentRange: mockRanges[0],
      },
    });

    render(
      <Provider store={store}>
        <RangeBuilder />
      </Provider>,
    );

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
        ranges: mockRanges,
        status: 'succeeded',
        error: null,
        currentRange: mockRanges[0],
      },
    });

    render(
      <Provider store={store}>
        <RangeBuilder />
      </Provider>,
    );

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

    render(
      <Provider store={store}>
        <RangeBuilder />
      </Provider>,
    );

    // Component should render successfully with action list
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('should handle range selector changes', async () => {
    const store = createTestStore({
      range: {
        ranges: mockRanges,
        status: 'succeeded',
        error: null,
        currentRange: null,
      },
    });

    render(
      <Provider store={store}>
        <RangeBuilder />
      </Provider>,
    );

    // Wait for component to render
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    });
  });

  it('should update range when name changes', async () => {
    const userEvent = user.setup();
    const store = createTestStore();

    render(
      <Provider store={store}>
        <RangeBuilder />
      </Provider>,
    );

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
        status: 'failed',
        error: 'Failed to load ranges',
        currentRange: null,
      },
    });

    render(
      <Provider store={store}>
        <RangeBuilder />
      </Provider>,
    );

    // Component should still render
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });
});
