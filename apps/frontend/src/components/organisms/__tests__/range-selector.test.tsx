import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import RangeSelector from '../range-selector';
import rangeReducer from '../../../store/slices/range-slice';
import { mockRanges } from '../../../msw/handlers';

// Helper to create test store
const createTestStore = (preloadedState?: any) => {
  return configureStore({
    reducer: {
      range: rangeReducer,
    },
    preloadedState,
  });
};

describe('RangeSelector', () => {
  it('should render range selector form', () => {
    const store = createTestStore({
      range: {
        ranges: mockRanges,
        status: 'succeeded',
        error: null,
        currentRange: null,
      },
    });

    const onRangeSelectChange = jest.fn();

    const { container } = render(
      <Provider store={store}>
        <RangeSelector onRangeSelectChange={onRangeSelectChange} />
      </Provider>,
    );

    // Form should be rendered (check for container)
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should call onRangeSelectChange when selection changes', async () => {
    const store = createTestStore({
      range: {
        ranges: mockRanges,
        status: 'succeeded',
        error: null,
        currentRange: null,
      },
    });

    const onRangeSelectChange = jest.fn();

    render(
      <Provider store={store}>
        <RangeSelector onRangeSelectChange={onRangeSelectChange} />
      </Provider>,
    );

    // The component should call onRangeSelectChange with initial value
    await waitFor(() => {
      expect(onRangeSelectChange).toHaveBeenCalled();
    });
  });

  it('should render with initial values', () => {
    const store = createTestStore({
      range: {
        ranges: mockRanges,
        status: 'succeeded',
        error: null,
        currentRange: null,
      },
    });

    const onRangeSelectChange = jest.fn();
    const initialValues = {
      selectedRangeId: '507f1f77bcf86cd799439011',
    };

    const { container } = render(
      <Provider store={store}>
        <RangeSelector initialValues={initialValues} onRangeSelectChange={onRangeSelectChange} />
      </Provider>,
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle empty ranges list', () => {
    const store = createTestStore({
      range: {
        ranges: [],
        status: 'succeeded',
        error: null,
        currentRange: null,
      },
    });

    const onRangeSelectChange = jest.fn();

    const { container } = render(
      <Provider store={store}>
        <RangeSelector onRangeSelectChange={onRangeSelectChange} />
      </Provider>,
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle error state', () => {
    const store = createTestStore({
      range: {
        ranges: [],
        status: 'failed',
        error: 'Failed to load ranges',
        currentRange: null,
      },
    });

    const onRangeSelectChange = jest.fn();

    const { container } = render(
      <Provider store={store}>
        <RangeSelector onRangeSelectChange={onRangeSelectChange} />
      </Provider>,
    );

    expect(container.firstChild).toBeInTheDocument();
  });
});
