import { render, screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import ActionList from '../action-list';
import { ActionDtoTypeEnum } from '../../../../backend-api/api';

describe('ActionList', () => {
  const mockActions = [
    { type: ActionDtoTypeEnum.Fold, frequency: 50 },
    { type: ActionDtoTypeEnum.Call, frequency: 30 },
    { type: ActionDtoTypeEnum.Raise, frequency: 20 },
  ];

  it('should render all actions', () => {
    const onActionChange = jest.fn();

    render(<ActionList actions={mockActions} onActionChange={onActionChange} />);

    // Each action should be rendered (case-insensitive)
    expect(screen.getByText(/fold/i)).toBeInTheDocument();
    expect(screen.getByText(/call/i)).toBeInTheDocument();
    expect(screen.getByText(/raise/i)).toBeInTheDocument();
  });

  it('should display action frequencies', () => {
    const onActionChange = jest.fn();

    render(<ActionList actions={mockActions} onActionChange={onActionChange} />);

    // Check that frequencies are displayed in input fields
    const inputs = screen.getAllByRole('textbox');
    expect(inputs[0]).toHaveValue('50');
    expect(inputs[1]).toHaveValue('30');
    expect(inputs[2]).toHaveValue('20');
  });

  it('should call onActionChange when action is modified', async () => {
    const userEvent = user.setup();
    const onActionChange = jest.fn();

    render(<ActionList actions={mockActions} onActionChange={onActionChange} />);

    // Find frequency input for Fold action
    const inputs = screen.getAllByRole('textbox');
    const foldInput = inputs[0];

    // Change frequency
    await userEvent.clear(foldInput);
    await userEvent.type(foldInput, '60');

    // Wait for debounce and state update
    await waitFor(
      () => {
        expect(onActionChange).toHaveBeenCalled();
      },
      { timeout: 2000 },
    );
  });

  it('should maintain total frequency of 100%', async () => {
    const userEvent = user.setup();
    const onActionChange = jest.fn();

    render(<ActionList actions={mockActions} onActionChange={onActionChange} />);

    const inputs = screen.getAllByRole('textbox');
    await userEvent.clear(inputs[0]);
    await userEvent.type(inputs[0], '60');

    await waitFor(
      () => {
        expect(onActionChange).toHaveBeenCalled();
        const newActions = onActionChange.mock.calls[onActionChange.mock.calls.length - 1][0];
        const total = newActions.reduce(
          (sum: number, action: { frequency: number }) => sum + action.frequency,
          0,
        );
        expect(total).toBe(100);
      },
      { timeout: 2000 },
    );
  });

  it('should distribute excess frequency to other actions', async () => {
    const userEvent = user.setup();
    const onActionChange = jest.fn();

    render(<ActionList actions={mockActions} onActionChange={onActionChange} />);

    const inputs = screen.getAllByRole('textbox');
    // Increase first action frequency
    await userEvent.clear(inputs[0]);
    await userEvent.type(inputs[0], '70');

    await waitFor(
      () => {
        expect(onActionChange).toHaveBeenCalled();
        const newActions = onActionChange.mock.calls[onActionChange.mock.calls.length - 1][0];
        // Total should still be 100
        const total = newActions.reduce(
          (sum: number, action: { frequency: number }) => sum + action.frequency,
          0,
        );
        expect(total).toBe(100);
        // First action should be 70
        expect(newActions[0].frequency).toBe(70);
      },
      { timeout: 2000 },
    );
  });

  it('should handle empty actions array', () => {
    const onActionChange = jest.fn();

    const { container } = render(<ActionList actions={[]} onActionChange={onActionChange} />);

    // Should render without errors
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle single action', () => {
    const onActionChange = jest.fn();
    const singleAction = [{ type: ActionDtoTypeEnum.Fold, frequency: 100 }];

    render(<ActionList actions={singleAction} onActionChange={onActionChange} />);

    expect(screen.getByText(/fold/i)).toBeInTheDocument();
  });

  it('should not allow negative frequencies', async () => {
    const userEvent = user.setup();
    const onActionChange = jest.fn();

    render(<ActionList actions={mockActions} onActionChange={onActionChange} />);

    const inputs = screen.getAllByRole('textbox');
    await userEvent.clear(inputs[0]);
    await userEvent.type(inputs[0], '-10');

    await waitFor(
      () => {
        if (onActionChange.mock.calls.length > 0) {
          const newActions = onActionChange.mock.calls[onActionChange.mock.calls.length - 1][0];
          newActions.forEach((action: { frequency: number }) => {
            expect(action.frequency).toBeGreaterThanOrEqual(0);
          });
        }
      },
      { timeout: 2000 },
    );
  });

  it('should preserve action types when frequencies change', async () => {
    const userEvent = user.setup();
    const onActionChange = jest.fn();

    render(<ActionList actions={mockActions} onActionChange={onActionChange} />);

    const inputs = screen.getAllByRole('textbox');
    await userEvent.clear(inputs[0]);
    await userEvent.type(inputs[0], '40');

    await waitFor(
      () => {
        if (onActionChange.mock.calls.length > 0) {
          const newActions = onActionChange.mock.calls[onActionChange.mock.calls.length - 1][0];
          // Action types should remain unchanged
          expect(newActions[0].type).toBe(ActionDtoTypeEnum.Fold);
          expect(newActions[1].type).toBe(ActionDtoTypeEnum.Call);
          expect(newActions[2].type).toBe(ActionDtoTypeEnum.Raise);
        }
      },
      { timeout: 2000 },
    );
  });
});
