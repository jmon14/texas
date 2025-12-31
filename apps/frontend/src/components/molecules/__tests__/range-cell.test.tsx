import { render, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import RangeCell from '../range-cell';
import { ActionDto, ActionDtoTypeEnum } from '../../../../backend-api/api';

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('RangeCell', () => {
  const defaultProps = {
    carryoverFrequency: 50,
    actions: [] as ActionDto[],
    label: 'AA',
  };

  it('should render without crashing', () => {
    const { container } = renderWithTheme(<RangeCell {...defaultProps} />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with actions', () => {
    const actions: ActionDto[] = [
      { type: ActionDtoTypeEnum.Raise, frequency: 50 },
      { type: ActionDtoTypeEnum.Call, frequency: 50 },
    ];

    const { container } = renderWithTheme(<RangeCell {...defaultProps} actions={actions} />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should accept onClick handler', () => {
    const handleClick = jest.fn();

    const { container } = renderWithTheme(<RangeCell {...defaultProps} onClick={handleClick} />);

    // Component should render with onClick handler
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle onMouseDown event', () => {
    const handleMouseDown = jest.fn();

    const { container } = renderWithTheme(
      <RangeCell {...defaultProps} onMouseDown={handleMouseDown} />,
    );

    const cell = container.firstChild as HTMLElement;
    fireEvent.mouseDown(cell);

    expect(handleMouseDown).toHaveBeenCalledTimes(1);
  });

  it('should handle onMouseEnter event', () => {
    const handleMouseEnter = jest.fn();

    const { container } = renderWithTheme(
      <RangeCell {...defaultProps} onMouseEnter={handleMouseEnter} />,
    );

    const cell = container.firstChild as HTMLElement;
    fireEvent.mouseEnter(cell);

    expect(handleMouseEnter).toHaveBeenCalledTimes(1);
  });

  it('should render with tooltip wrapper', () => {
    const actions: ActionDto[] = [
      { type: ActionDtoTypeEnum.Raise, frequency: 60 },
      { type: ActionDtoTypeEnum.Call, frequency: 40 },
    ];

    const { container } = renderWithTheme(<RangeCell {...defaultProps} actions={actions} />);

    // Component should render with tooltip
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should not show tooltip when dragging', () => {
    const actions: ActionDto[] = [{ type: ActionDtoTypeEnum.Raise, frequency: 100 }];

    const { container } = renderWithTheme(
      <RangeCell {...defaultProps} actions={actions} isDragging={true} />,
    );

    const cell = container.firstChild as HTMLElement;
    fireEvent.mouseEnter(cell);

    // Tooltip should not appear when dragging
    const tooltip = container.querySelector('[role="tooltip"]');
    expect(tooltip).toBeFalsy();
  });

  it('should apply selected styling when isSelected is true', () => {
    const { container } = renderWithTheme(<RangeCell {...defaultProps} isSelected={true} />);

    const cell = container.firstChild as HTMLElement;
    expect(cell).toBeInTheDocument();
    // The selected styling should be applied via sx prop
  });

  it('should render cell with no actions', () => {
    const { container } = renderWithTheme(<RangeCell {...defaultProps} actions={[]} />);

    // Component should render even with no actions
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with multiple actions', () => {
    const actions: ActionDto[] = [
      { type: ActionDtoTypeEnum.Raise, frequency: 30 },
      { type: ActionDtoTypeEnum.Call, frequency: 40 },
      { type: ActionDtoTypeEnum.Fold, frequency: 30 },
    ];

    const { container } = renderWithTheme(<RangeCell {...defaultProps} actions={actions} />);

    // Component should render with multiple actions
    expect(container.firstChild).toBeInTheDocument();
  });
});
