import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DifficultyBadge from '../../atoms/difficulty-badge';
import { ScenarioResponseDtoDifficultyEnum } from '../../../../backend-api/api';

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('DifficultyBadge', () => {
  it('should render beginner badge with success color', () => {
    const { container } = renderWithTheme(
      <DifficultyBadge difficulty={ScenarioResponseDtoDifficultyEnum.Beginner} />,
    );

    expect(screen.getByText('Beginner')).toBeInTheDocument();
    const chip = container.querySelector('.MuiChip-root');
    expect(chip).toHaveClass('MuiChip-colorSuccess');
  });

  it('should render intermediate badge with warning color', () => {
    const { container } = renderWithTheme(
      <DifficultyBadge difficulty={ScenarioResponseDtoDifficultyEnum.Intermediate} />,
    );

    expect(screen.getByText('Intermediate')).toBeInTheDocument();
    const chip = container.querySelector('.MuiChip-root');
    expect(chip).toHaveClass('MuiChip-colorWarning');
  });

  it('should render advanced badge with error color', () => {
    const { container } = renderWithTheme(
      <DifficultyBadge difficulty={ScenarioResponseDtoDifficultyEnum.Advanced} />,
    );

    expect(screen.getByText('Advanced')).toBeInTheDocument();
    const chip = container.querySelector('.MuiChip-root');
    expect(chip).toHaveClass('MuiChip-colorError');
  });

  it('should render small size by default', () => {
    const { container } = renderWithTheme(
      <DifficultyBadge difficulty={ScenarioResponseDtoDifficultyEnum.Beginner} />,
    );

    expect(screen.getByText('Beginner')).toBeInTheDocument();
    const chip = container.querySelector('.MuiChip-root');
    expect(chip).toHaveClass('MuiChip-sizeSmall');
  });

  it('should accept additional chip props', () => {
    renderWithTheme(
      <DifficultyBadge
        difficulty={ScenarioResponseDtoDifficultyEnum.Beginner}
        data-testid="custom-badge"
      />,
    );

    const chip = screen.getByTestId('custom-badge');
    expect(chip).toBeInTheDocument();
  });
});
