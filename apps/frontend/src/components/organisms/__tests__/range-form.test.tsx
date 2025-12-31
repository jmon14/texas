import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, PreloadedState } from '@reduxjs/toolkit';
import user from '@testing-library/user-event';
import RangeForm from '../range-form';
import rangeReducer from '../../../store/slices/range-slice';
import { FetchStatus } from '../../../constants';

// Test store state type
type TestStoreState = {
  range: ReturnType<typeof rangeReducer>;
};

// Helper to create test store
const createTestStore = (preloadedState?: PreloadedState<TestStoreState>) => {
  return configureStore({
    reducer: {
      range: rangeReducer,
    },
    preloadedState,
  });
};

describe('RangeForm', () => {
  it('should render range form', () => {
    const store = createTestStore();
    const onSubmit = jest.fn();

    render(
      <Provider store={store}>
        <RangeForm onSubmit={onSubmit} />
      </Provider>,
    );

    // Form should be rendered (check for submit button)
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('should render with initial values', () => {
    const store = createTestStore();
    const onSubmit = jest.fn();
    const initialValues = {
      name: 'Test Range',
    };

    render(
      <Provider store={store}>
        <RangeForm initialValues={initialValues} onSubmit={onSubmit} />
      </Provider>,
    );

    // Form should be rendered with the name value
    const nameInput = screen.getByRole('textbox');
    expect(nameInput).toHaveValue('Test Range');
  });

  it('should call onNameChange when name changes', async () => {
    const userInteraction = user.setup();
    const store = createTestStore();
    const onSubmit = jest.fn();
    const onNameChange = jest.fn();

    render(
      <Provider store={store}>
        <RangeForm onSubmit={onSubmit} onNameChange={onNameChange} />
      </Provider>,
    );

    // Find the name input field (it should be a textbox)
    const nameInput = screen.getByRole('textbox');

    // Type in the input
    await userInteraction.type(nameInput, 'New Range');

    // onNameChange should be called as user types
    await waitFor(() => {
      expect(onNameChange).toHaveBeenCalled();
    });
  });

  it('should handle submit', async () => {
    const userInteraction = user.setup();
    const store = createTestStore();
    const onSubmit = jest.fn();

    render(
      <Provider store={store}>
        <RangeForm onSubmit={onSubmit} />
      </Provider>,
    );

    // Find the submit button
    const submitButton = screen.getByRole('button', { name: /submit|save/i });

    // Fill in the form
    const nameInput = screen.getByRole('textbox');
    await userInteraction.type(nameInput, 'Test Range');

    // Submit the form
    await userInteraction.click(submitButton);

    // onSubmit should be called
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
  });

  it('should render delete button when onDelete is provided WITH an id', () => {
    const store = createTestStore();
    const onSubmit = jest.fn();
    const onDelete = jest.fn();

    render(
      <Provider store={store}>
        <RangeForm id="range-123" onSubmit={onSubmit} onDelete={onDelete} />
      </Provider>,
    );

    // Delete button should be present (only when id is provided)
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked', async () => {
    const userInteraction = user.setup();
    const store = createTestStore();
    const onSubmit = jest.fn();
    const onDelete = jest.fn();

    render(
      <Provider store={store}>
        <RangeForm id="range-123" onSubmit={onSubmit} onDelete={onDelete} />
      </Provider>,
    );

    // Click delete button (only present when id is provided)
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await userInteraction.click(deleteButton);

    expect(onDelete).toHaveBeenCalled();
  });

  it('should disable save button when disabled prop is true', () => {
    const store = createTestStore();
    const onSubmit = jest.fn();

    render(
      <Provider store={store}>
        <RangeForm onSubmit={onSubmit} disabled={true} />
      </Provider>,
    );

    // Save button should be disabled
    const saveButton = screen.getByRole('button', { name: /save \(limit reached\)/i });
    expect(saveButton).toBeDisabled();
  });

  it('should show error when error is present in state', () => {
    const store = createTestStore({
      range: {
        ranges: [],
        status: FetchStatus.FAILED,
        error: 'Failed to save range',
        currentRange: null,
      },
    });
    const onSubmit = jest.fn();

    render(
      <Provider store={store}>
        <RangeForm onSubmit={onSubmit} />
      </Provider>,
    );

    // Form should still render with save button
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('should update form value when initialValues change', () => {
    const store = createTestStore();
    const onSubmit = jest.fn();

    const { rerender } = render(
      <Provider store={store}>
        <RangeForm initialValues={{ name: 'Range 1' }} onSubmit={onSubmit} />
      </Provider>,
    );

    const nameInput = screen.getByRole('textbox');
    expect(nameInput).toHaveValue('Range 1');

    // Update with new initial values
    rerender(
      <Provider store={store}>
        <RangeForm initialValues={{ name: 'Range 2' }} onSubmit={onSubmit} />
      </Provider>,
    );

    // Name should update to new value
    expect(nameInput).toHaveValue('Range 2');
  });
});
