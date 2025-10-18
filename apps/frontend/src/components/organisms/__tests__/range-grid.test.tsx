import { render, screen, fireEvent } from '@testing-library/react';
import RangeGrid from '../range-grid';
import { RangeResponseDto } from '../../../../backend-api/api';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme();

const mockRange: Partial<RangeResponseDto> = {
  _id: 'test-range-1',
  name: 'Test Range',
  userId: 'user-123',
  handsRange: [
    {
      rangeFraction: 0.5,
      label: 'RAISE',
      actions: [{ type: 'RAISE' as any, percentage: 50 }],
    },
    {
      rangeFraction: 0.3,
      label: 'CALL',
      actions: [{ type: 'CALL' as any, percentage: 30 }],
    },
    {
      rangeFraction: 0.2,
      label: 'FOLD',
      actions: [{ type: 'FOLD' as any, percentage: 20 }],
    },
    {
      rangeFraction: 0.1,
      label: 'CHECK',
      actions: [{ type: 'CHECK' as any, percentage: 10 }],
    },
  ],
};

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('RangeGrid', () => {
  it('should render range cells', () => {
    renderWithTheme(<RangeGrid range={mockRange} />);

    // Check if cells are rendered (checking for labels)
    expect(screen.getByText('RAISE')).toBeInTheDocument();
    expect(screen.getByText('CALL')).toBeInTheDocument();
    expect(screen.getByText('FOLD')).toBeInTheDocument();
    expect(screen.getByText('CHECK')).toBeInTheDocument();
  });

  it('should handle cell click', () => {
    const onCellClick = jest.fn();
    renderWithTheme(<RangeGrid range={mockRange} onCellClick={onCellClick} />);

    const raiseCell = screen.getByText('RAISE').closest('div');
    if (raiseCell) {
      fireEvent.click(raiseCell);
      expect(onCellClick).toHaveBeenCalledWith(0);
    }
  });

  it('should handle mouse down on cell', () => {
    const onCellsSelect = jest.fn();
    renderWithTheme(<RangeGrid range={mockRange} onCellsSelect={onCellsSelect} />);

    const raiseCell = screen.getByText('RAISE').closest('div');
    if (raiseCell) {
      fireEvent.mouseDown(raiseCell);
      fireEvent.mouseUp(raiseCell);

      // onCellsSelect should be called after mouse up
      expect(onCellsSelect).toHaveBeenCalled();
    }
  });

  it('should handle mouse drag selection', () => {
    const onCellsSelect = jest.fn();
    renderWithTheme(<RangeGrid range={mockRange} onCellsSelect={onCellsSelect} />);

    const raiseCell = screen.getByText('RAISE').closest('div');
    const callCell = screen.getByText('CALL').closest('div');

    if (raiseCell && callCell) {
      // Start dragging on first cell
      fireEvent.mouseDown(raiseCell);

      // Move to second cell
      fireEvent.mouseEnter(callCell);

      // Release mouse
      fireEvent.mouseUp(document);

      // Should have selected multiple cells
      expect(onCellsSelect).toHaveBeenCalled();
      const selectedIndices = onCellsSelect.mock.calls[0][0];
      expect(selectedIndices).toContain(0);
      expect(selectedIndices).toContain(1);
    }
  });

  it('should render grid container with cells', () => {
    const { container } = renderWithTheme(<RangeGrid range={mockRange} />);

    // Should render container with all cells
    expect(container.firstChild).toBeInTheDocument();
    expect(screen.getAllByText(/RAISE|CALL|FOLD|CHECK/)).toHaveLength(4);
  });

  it('should handle empty range', () => {
    const emptyRange: Partial<RangeResponseDto> = {
      handsRange: [],
    };

    const { container } = renderWithTheme(<RangeGrid range={emptyRange} />);

    // Should render container but no cells
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should not call onCellsSelect without mouse down', () => {
    const onCellsSelect = jest.fn();
    renderWithTheme(<RangeGrid range={mockRange} onCellsSelect={onCellsSelect} />);

    const callCell = screen.getByText('CALL').closest('div');

    if (callCell) {
      // Just hover without mouse down
      fireEvent.mouseEnter(callCell);
      fireEvent.mouseUp(document);

      // Should not call onCellsSelect
      expect(onCellsSelect).not.toHaveBeenCalled();
    }
  });
});
