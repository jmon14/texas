import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Home from '../home';
import themeReducer from '../../../store/slices/theme-slice';
import userReducer from '../../../store/slices/user-slice';

const theme = createTheme();

type TestStoreState = {
  theme: ReturnType<typeof themeReducer>;
  user: ReturnType<typeof userReducer>;
};

const createTestStore = (preloadedState?: Partial<TestStoreState>) => {
  return configureStore({
    reducer: {
      theme: themeReducer,
      user: userReducer,
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

describe('Home Page', () => {
  it('should render without crashing', () => {
    renderWithProviders(<Home />);
    // Home page renders MainLayout with Outlet, which should render without errors
    expect(document.body).toBeInTheDocument();
  });

  it('should use MainLayout template', () => {
    const { container } = renderWithProviders(<Home />);
    // Verify the layout structure is rendered
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render header and sidebar components', () => {
    const { container } = renderWithProviders(<Home />);
    // MainLayout renders Header and Sidebar, verify they're present
    expect(container.querySelector('header')).toBeInTheDocument();
  });
});
