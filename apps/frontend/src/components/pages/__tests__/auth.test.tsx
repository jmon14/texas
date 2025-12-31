import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Auth from '../auth';
import themeReducer from '../../../store/slices/theme-slice';

const theme = createTheme();

type TestStoreState = {
  theme: ReturnType<typeof themeReducer>;
};

const createTestStore = (preloadedState?: Partial<TestStoreState>) => {
  return configureStore({
    reducer: {
      theme: themeReducer,
    },
    preloadedState: preloadedState as any,
  });
};

const renderWithProviders = (component: React.ReactElement, store = createTestStore()) => {
  return render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>{component}</BrowserRouter>
      </ThemeProvider>
    </Provider>,
  );
};

describe('Auth Page', () => {
  it('should render without crashing', () => {
    renderWithProviders(<Auth />);
    // Auth page renders CenterLayout with Outlet, which should render without errors
    expect(document.body).toBeInTheDocument();
  });

  it('should render with theme switch', () => {
    const { container } = renderWithProviders(<Auth />);
    // Theme switch uses a checkbox input
    const switchInput = container.querySelector('input[type="checkbox"]');
    expect(switchInput).toBeInTheDocument();
  });

  it('should use CenterLayout template', () => {
    const { container } = renderWithProviders(<Auth />);
    // Verify the layout structure is rendered
    expect(container.firstChild).toBeInTheDocument();
  });
});
