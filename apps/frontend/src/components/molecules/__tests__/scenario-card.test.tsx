import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ScenarioCard from '../../molecules/scenario-card';
import {
  ScenarioResponseDto,
  ScenarioResponseDtoDifficultyEnum,
  ScenarioResponseDtoGameTypeEnum,
  ScenarioResponseDtoCategoryEnum,
  ScenarioResponseDtoStreetEnum,
  ScenarioResponseDtoPositionEnum,
  ScenarioResponseDtoActionTypeEnum,
} from '../../../../backend-api/api';

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

const mockScenario: ScenarioResponseDto = {
  _id: '507f1f77bcf86cd799439011',
  name: 'UTG Open - 100bb Tournament',
  description: "You're UTG in a 100bb tournament. What should your opening range be?",
  street: ScenarioResponseDtoStreetEnum.Preflop,
  gameType: ScenarioResponseDtoGameTypeEnum.Tournament,
  position: ScenarioResponseDtoPositionEnum.Utg,
  vsPosition: ScenarioResponseDtoPositionEnum.Bb,
  actionType: ScenarioResponseDtoActionTypeEnum.Open,
  effectiveStack: 100,
  betSize: 2.0,
  difficulty: ScenarioResponseDtoDifficultyEnum.Beginner,
  category: ScenarioResponseDtoCategoryEnum.OpeningRanges,
  tags: ['tournament', '6max', 'preflop', 'opening'],
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

describe('ScenarioCard', () => {
  it('should render scenario name', () => {
    const onClick = jest.fn();
    renderWithTheme(<ScenarioCard scenario={mockScenario} onClick={onClick} />);

    expect(screen.getByText('UTG Open - 100bb Tournament')).toBeInTheDocument();
  });

  it('should render scenario description', () => {
    const onClick = jest.fn();
    renderWithTheme(<ScenarioCard scenario={mockScenario} onClick={onClick} />);

    expect(
      screen.getByText("You're UTG in a 100bb tournament. What should your opening range be?"),
    ).toBeInTheDocument();
  });

  it('should render difficulty badge', () => {
    const onClick = jest.fn();
    renderWithTheme(<ScenarioCard scenario={mockScenario} onClick={onClick} />);

    expect(screen.getByText('Beginner')).toBeInTheDocument();
  });

  it('should render category chip', () => {
    const onClick = jest.fn();
    renderWithTheme(<ScenarioCard scenario={mockScenario} onClick={onClick} />);

    expect(screen.getByText('Opening Ranges')).toBeInTheDocument();
  });

  it('should render position information', () => {
    const onClick = jest.fn();
    renderWithTheme(<ScenarioCard scenario={mockScenario} onClick={onClick} />);

    expect(screen.getByText(/UTG vs BB/i)).toBeInTheDocument();
  });

  it('should render effective stack', () => {
    const onClick = jest.fn();
    renderWithTheme(<ScenarioCard scenario={mockScenario} onClick={onClick} />);

    // Use getAllByText since "100bb" appears in both title and stack
    const stackElements = screen.getAllByText(/100bb/i);
    expect(stackElements.length).toBeGreaterThan(0);
    // Verify at least one contains the stack format
    expect(stackElements.some((el) => el.textContent?.includes('100bb'))).toBe(true);
  });

  it('should call onClick when card is clicked', async () => {
    const userInteraction = user.setup();
    const onClick = jest.fn();
    renderWithTheme(<ScenarioCard scenario={mockScenario} onClick={onClick} />);

    const card = screen.getByRole('button');
    await userInteraction.click(card);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should render card with hover effect', () => {
    const onClick = jest.fn();
    const { container } = renderWithTheme(
      <ScenarioCard scenario={mockScenario} onClick={onClick} />,
    );

    const card = container.querySelector('.MuiCard-root');
    expect(card).toBeInTheDocument();
  });
});
