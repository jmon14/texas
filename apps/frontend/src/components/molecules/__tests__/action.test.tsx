import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ActionComponent from '../action';
import { ActionDto } from '../../../../backend-api/api';

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('ActionComponent', () => {
  const mockAction: ActionDto = {
    type: 'RAISE' as any,
    percentage: 50,
  };

  it('should render action type', () => {
    const onChange = jest.fn();
    renderWithTheme(<ActionComponent initialAction={mockAction} onChange={onChange} />);

    expect(screen.getByText('RAISE')).toBeInTheDocument();
  });

  it('should render initial percentage', () => {
    const onChange = jest.fn();
    renderWithTheme(<ActionComponent initialAction={mockAction} onChange={onChange} />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('50');
  });

  it('should update percentage value when user types', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    renderWithTheme(<ActionComponent initialAction={mockAction} onChange={onChange} />);

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, '75');

    expect(input).toHaveValue('75');
  });

  it('should call onChange with updated percentage (debounced)', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    renderWithTheme(<ActionComponent initialAction={mockAction} onChange={onChange} />);

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, '80');

    // Wait for debounce
    await waitFor(
      () => {
        expect(onChange).toHaveBeenCalledWith({
          type: 'RAISE',
          percentage: 80,
        });
      },
      { timeout: 500 },
    );
  });

  it('should clamp percentage to maximum 100', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    renderWithTheme(<ActionComponent initialAction={mockAction} onChange={onChange} />);

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, '150');

    // Value should be clamped to 100
    await waitFor(
      () => {
        expect(input).toHaveValue('100');
      },
      { timeout: 500 },
    );
  });

  it('should clamp percentage to minimum 0', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    renderWithTheme(<ActionComponent initialAction={mockAction} onChange={onChange} />);

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, '-10');

    // Value should be clamped to 0
    await waitFor(
      () => {
        expect(input).toHaveValue('0');
      },
      { timeout: 500 },
    );
  });

  it('should handle different action types', () => {
    const callAction: ActionDto = { type: 'CALL' as any, percentage: 30 };
    const onChange = jest.fn();

    renderWithTheme(<ActionComponent initialAction={callAction} onChange={onChange} />);

    expect(screen.getByText('CALL')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue('30');
  });

  it('should update when initialAction changes', () => {
    const onChange = jest.fn();
    const { rerender } = renderWithTheme(
      <ActionComponent initialAction={mockAction} onChange={onChange} />,
    );

    expect(screen.getByText('RAISE')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue('50');

    // Update with new action
    const newAction: ActionDto = { type: 'FOLD' as any, percentage: 25 };
    rerender(
      <ThemeProvider theme={theme}>
        <ActionComponent initialAction={newAction} onChange={onChange} />
      </ThemeProvider>,
    );

    expect(screen.getByText('FOLD')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue('25');
  });

  it('should handle invalid percentage input', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    renderWithTheme(<ActionComponent initialAction={mockAction} onChange={onChange} />);

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'abc');

    // Should still allow typing
    expect(input).toHaveValue('abc');

    // Should call onChange with 0 percentage
    await waitFor(
      () => {
        expect(onChange).toHaveBeenCalledWith({
          type: 'RAISE',
          percentage: 0,
        });
      },
      { timeout: 500 },
    );
  });

  it('should render action component container', () => {
    const onChange = jest.fn();
    const { container } = renderWithTheme(
      <ActionComponent initialAction={mockAction} onChange={onChange} />,
    );

    // Should render the main container
    expect(container.firstChild).toBeInTheDocument();
    expect(screen.getByText('RAISE')).toBeInTheDocument();
  });
});
