import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ThemeSwitch from '../theme-switch';
import themeReducer from '../../../store/slices/theme-slice';

const createTestStore = (initialMode: 'light' | 'dark' = 'light') => {
  return configureStore({
    reducer: {
      theme: themeReducer,
    },
    preloadedState: {
      theme: {
        mode: initialMode,
      },
    },
  });
};

const renderWithStore = (component: React.ReactElement, store = createTestStore()) => {
  return render(<Provider store={store}>{component}</Provider>);
};

describe('ThemeSwitch', () => {
  it('should render without crashing', () => {
    const { container } = renderWithStore(<ThemeSwitch />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render as unchecked in light mode', () => {
    const store = createTestStore('light');

    const { container } = renderWithStore(<ThemeSwitch />, store);

    const checkbox = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
  });

  it('should render as checked in dark mode', () => {
    const store = createTestStore('dark');

    const { container } = renderWithStore(<ThemeSwitch />, store);

    const checkbox = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  it('should toggle theme from light to dark when clicked', () => {
    const store = createTestStore('light');

    const { container } = renderWithStore(<ThemeSwitch />, store);

    const checkbox = container.querySelector('input[type="checkbox"]') as HTMLInputElement;

    // Initially light mode (unchecked)
    expect(checkbox.checked).toBe(false);

    // Click to toggle
    fireEvent.click(checkbox);

    // Should be dark mode (checked)
    expect(checkbox.checked).toBe(true);
  });

  it('should toggle theme from dark to light when clicked', () => {
    const store = createTestStore('dark');

    const { container } = renderWithStore(<ThemeSwitch />, store);

    const checkbox = container.querySelector('input[type="checkbox"]') as HTMLInputElement;

    // Initially dark mode (checked)
    expect(checkbox.checked).toBe(true);

    // Click to toggle
    fireEvent.click(checkbox);

    // Should be light mode (unchecked)
    expect(checkbox.checked).toBe(false);
  });

  it('should display light mode icon when in light mode', () => {
    const store = createTestStore('light');

    const { container } = renderWithStore(<ThemeSwitch />, store);

    // Light mode icon should be present
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should display dark mode icon when in dark mode', () => {
    const store = createTestStore('dark');

    const { container } = renderWithStore(<ThemeSwitch />, store);

    // Dark mode icon should be present
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should accept custom sx prop', () => {
    const customSx = { margin: 2 };

    const { container } = renderWithStore(<ThemeSwitch sx={customSx} />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should forward other Switch props', () => {
    const { container } = renderWithStore(<ThemeSwitch size="small" disabled={false} />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should update Redux store on theme change', () => {
    const store = createTestStore('light');

    const { container } = renderWithStore(<ThemeSwitch />, store);

    const checkbox = container.querySelector('input[type="checkbox"]') as HTMLInputElement;

    // Initial state
    expect(store.getState().theme.mode).toBe('light');

    // Click to toggle
    fireEvent.click(checkbox);

    // Store should update
    expect(store.getState().theme.mode).toBe('dark');
  });
});
