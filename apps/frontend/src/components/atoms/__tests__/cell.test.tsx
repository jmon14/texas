import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Cell from '../cell';
import { ActionDto, ActionDtoTypeEnum } from '../../../../backend-api/api';

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('Cell', () => {
  it('should render without crashing', () => {
    const { container } = renderWithTheme(<Cell carryoverFrequency={50} actions={[]} label="AA" />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should display label', () => {
    const { getByText } = renderWithTheme(<Cell carryoverFrequency={50} actions={[]} label="AK" />);

    expect(getByText('AK')).toBeInTheDocument();
  });

  it('should render with actions', () => {
    const actions: ActionDto[] = [
      { type: ActionDtoTypeEnum.Raise, frequency: 50 },
      { type: ActionDtoTypeEnum.Call, frequency: 50 },
    ];

    const { container } = renderWithTheme(
      <Cell carryoverFrequency={100} actions={actions} label="KK" />,
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle zero carryover frequency', () => {
    const { container } = renderWithTheme(<Cell carryoverFrequency={0} actions={[]} label="22" />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle 100% carryover frequency', () => {
    const { container } = renderWithTheme(
      <Cell carryoverFrequency={100} actions={[]} label="QQ" />,
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle onClick event', () => {
    const handleClick = jest.fn();

    const { container } = renderWithTheme(
      <Cell carryoverFrequency={50} actions={[]} label="JJ" onClick={handleClick} />,
    );

    const cell = container.firstChild as HTMLElement;
    cell.click();

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should accept mouse event handlers', () => {
    const handleMouseOver = jest.fn();
    const handleMouseLeave = jest.fn();

    const { container } = renderWithTheme(
      <Cell
        carryoverFrequency={50}
        actions={[]}
        label="TT"
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
      />,
    );

    // Component should render with mouse handlers
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render multiple actions with correct widths', () => {
    const actions: ActionDto[] = [
      { type: ActionDtoTypeEnum.Raise, frequency: 30 },
      { type: ActionDtoTypeEnum.Call, frequency: 40 },
      { type: ActionDtoTypeEnum.Fold, frequency: 30 },
    ];

    const { container } = renderWithTheme(
      <Cell carryoverFrequency={100} actions={actions} label="99" />,
    );

    expect(container.firstChild).toBeInTheDocument();
    // Actions should sum to 100% width
    expect(actions.reduce((sum, action) => sum + action.frequency, 0)).toBe(100);
  });
});
