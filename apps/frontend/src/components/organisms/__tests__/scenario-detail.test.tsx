import { render, screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ScenarioDetail from '../scenario-detail';
import scenarioReducer from '../../../store/slices/scenario-slice';
import { mockScenarios } from '../../../msw/handlers';
import { FetchStatus } from '../../../constants';

const theme = createTheme();

// Helper to create test store
const createTestStore = (preloadedState?: any) => {
  return configureStore({
    reducer: {
      scenario: scenarioReducer,
    },
    preloadedState,
  });
};

const renderWithProviders = (
  component: React.ReactElement,
  store: ReturnType<typeof createTestStore>,
  initialEntries = ['/scenarios/507f1f77bcf86cd799439011'],
) => {
  return render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={initialEntries}>{component}</MemoryRouter>
      </ThemeProvider>
    </Provider>,
  );
};

describe('ScenarioDetail', () => {
  it('should render scenario name', async () => {
    const store = createTestStore({
      scenario: {
        scenarios: [],
        status: FetchStatus.SUCCEDED,
        error: null,
        currentScenario: mockScenarios[0],
      },
    });

    renderWithProviders(<ScenarioDetail />, store);

    await waitFor(() => {
      expect(screen.getByText('UTG Open - 100bb Tournament')).toBeInTheDocument();
    });
  });

  it('should render scenario description', async () => {
    const store = createTestStore({
      scenario: {
        scenarios: [],
        status: FetchStatus.SUCCEDED,
        error: null,
        currentScenario: mockScenarios[0],
      },
    });

    renderWithProviders(<ScenarioDetail />, store);

    await waitFor(() => {
      expect(
        screen.getByText("You're UTG in a 100bb tournament. What should your opening range be?"),
      ).toBeInTheDocument();
    });
  });

  it('should render difficulty badge', async () => {
    const store = createTestStore({
      scenario: {
        scenarios: [],
        status: FetchStatus.SUCCEDED,
        error: null,
        currentScenario: mockScenarios[0],
      },
    });

    renderWithProviders(<ScenarioDetail />, store);

    await waitFor(() => {
      expect(screen.getByText('Beginner')).toBeInTheDocument();
    });
  });

  it('should render category chip', async () => {
    const store = createTestStore({
      scenario: {
        scenarios: [],
        status: FetchStatus.SUCCEDED,
        error: null,
        currentScenario: mockScenarios[0],
      },
    });

    renderWithProviders(<ScenarioDetail />, store);

    await waitFor(() => {
      expect(screen.getByText('Opening Ranges')).toBeInTheDocument();
    });
  });

  it('should render scenario details', async () => {
    const store = createTestStore({
      scenario: {
        scenarios: [],
        status: FetchStatus.SUCCEDED,
        error: null,
        currentScenario: mockScenarios[0],
      },
    });

    renderWithProviders(<ScenarioDetail />, store);

    await waitFor(() => {
      // "preflop" appears in both Street and tags, so use getAllByText
      expect(screen.getAllByText(/preflop/i).length).toBeGreaterThan(0);
      // "tournament" appears in both Game Type and tags, so use getAllByText
      expect(screen.getAllByText(/tournament/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/UTG vs BB/i)).toBeInTheDocument();
      // "100bb" appears in both title and effective stack, so use getAllByText
      expect(screen.getAllByText(/100bb/i).length).toBeGreaterThan(0);
    });
  });

  it('should render previous actions if present', async () => {
    const store = createTestStore({
      scenario: {
        scenarios: [],
        status: FetchStatus.SUCCEDED,
        error: null,
        currentScenario: mockScenarios[1], // This one has previousActions
      },
    });

    renderWithProviders(<ScenarioDetail />, store, ['/scenarios/507f1f77bcf86cd799439012']);

    await waitFor(() => {
      expect(screen.getByText(/Previous Actions/i)).toBeInTheDocument();
    });
  });

  it('should render tags if present', async () => {
    const store = createTestStore({
      scenario: {
        scenarios: [],
        status: FetchStatus.SUCCEDED,
        error: null,
        currentScenario: mockScenarios[0],
      },
    });

    renderWithProviders(<ScenarioDetail />, store);

    await waitFor(() => {
      // Tags section should be rendered
      const tagsSection = screen.getByText('Tags');
      expect(tagsSection).toBeInTheDocument();
      // "tournament" appears in both Game Type and tags, so use getAllByText
      const tournamentElements = screen.getAllByText('tournament');
      expect(tournamentElements.length).toBeGreaterThan(0);
      // Verify tags are rendered as chips
      expect(screen.getByText('6max')).toBeInTheDocument();
    });
  });

  it('should display loading state', () => {
    const store = createTestStore({
      scenario: {
        scenarios: [],
        status: FetchStatus.LOADING,
        error: null,
        currentScenario: null,
      },
    });

    renderWithProviders(<ScenarioDetail />, store);

    const loadingIndicator = screen.getByRole('progressbar');
    expect(loadingIndicator).toBeInTheDocument();
  });

  it('should display error state', () => {
    const store = createTestStore({
      scenario: {
        scenarios: [],
        status: FetchStatus.FAILED,
        error: 'Failed to load scenario',
        currentScenario: null,
      },
    });

    renderWithProviders(<ScenarioDetail />, store);

    expect(screen.getByText(/Failed to load scenario/i)).toBeInTheDocument();
    expect(screen.getByText(/Back to Scenarios/i)).toBeInTheDocument();
  });

  it('should render disabled Start Practice button', async () => {
    const store = createTestStore({
      scenario: {
        scenarios: [],
        status: FetchStatus.SUCCEDED,
        error: null,
        currentScenario: mockScenarios[0],
      },
    });

    renderWithProviders(<ScenarioDetail />, store);

    await waitFor(() => {
      const button = screen.getByText('Start Practice');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('title', 'Coming in Phase 4');
    });
  });

  it('should navigate back to list on back button click', async () => {
    const userInteraction = user.setup();
    const store = createTestStore({
      scenario: {
        scenarios: [],
        status: FetchStatus.SUCCEDED,
        error: null,
        currentScenario: mockScenarios[0],
      },
    });

    renderWithProviders(<ScenarioDetail />, store);

    await waitFor(() => {
      const backButton = screen.getByText(/Back to Scenarios/i);
      expect(backButton).toBeInTheDocument();
    });

    const backButton = screen.getByText(/Back to Scenarios/i);
    await userInteraction.click(backButton);
    // Navigation would happen here - in a real test we'd check the URL
  });
});
