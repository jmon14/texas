import Box from '@mui/material/Box';
import { ActionDto } from '../../../backend-api/api';
import ActionComponent from '../molecules/action';
import Panel from '../atoms/panel';

/**
 * Props for the ActionList component
 * @interface ActionListProps
 */
type ActionListProps = {
  /** Array of poker actions with types and frequencies */
  actions: ActionDto[];
  /** Callback when actions are changed (frequencies auto-balanced to 100%) */
  onActionChange: (actions: ActionDto[]) => void;
};

/**
 * ActionList component for managing poker action frequencies with auto-balancing.
 *
 * Displays a horizontal list of action editors (Raise, Call, Fold, etc.) where users
 * can adjust frequency percentages. Automatically redistributes frequencies to ensure
 * they sum to exactly 100% when any action is modified. Uses a smart algorithm to
 * distribute excess/deficit frequencies across other actions without violating 0-100% bounds.
 *
 * @component
 * @example
 * ```tsx
 * Basic usage with default actions
 * const [actions, setActions] = useState([
 *   { type: 'Raise', frequency: 50 },
 *   { type: 'Call', frequency: 30 },
 *   { type: 'Fold', frequency: 20 }
 * ]);
 *
 * <ActionList
 *   actions={actions}
 *   onActionChange={setActions}
 * />
 * ```
 *
 * @example
 * In range builder context
 * ```tsx
 * const handleActionChange = (updatedActions: ActionDto[]) => {
 *   setCurrentActions(updatedActions);
 *   // Actions will always sum to 100%
 * };
 *
 * <ActionList
 *   actions={currentActions}
 *   onActionChange={handleActionChange}
 * />
 * ```
 *
 * @param {ActionListProps} props - The component props
 * @param {ActionDto[]} props.actions - Current action frequencies
 * @param {Function} props.onActionChange - Callback with auto-balanced actions
 * @returns {JSX.Element} Rendered action list panel with frequency editors
 *
 * @remarks
 * Auto-balancing algorithm:
 * 1. User modifies one action's frequency
 * 2. Calculate total frequency of all actions
 * 3. If total ≠ 100%, distribute the difference across other actions
 * 4. Start from the next action after the modified one (round-robin)
 * 5. Add/subtract frequencies respecting 0-100% bounds
 * 6. Ensure no action goes negative
 *
 * This ensures frequencies always sum to 100% without user intervention.
 */
const ActionList = ({ actions, onActionChange }: ActionListProps) => {
  const handleActionChange = (index: number, updatedAction: ActionDto) => {
    // Create a new array with new instances of the objects
    const newActions = actions.map((action, i) => (i === index ? updatedAction : { ...action }));

    // Calculate the total frequency
    const totalFrequency = newActions.reduce((sum, action) => sum + action.frequency, 0);

    if (totalFrequency !== 100) {
      let remainingFrequency = 100 - totalFrequency;

      if (remainingFrequency > 0) {
        // Distribute the remaining frequency without exceeding 100%
        let currentIndex = index + 1;
        while (remainingFrequency > 0) {
          if (currentIndex >= newActions.length) {
            currentIndex = 0;
          }
          if (currentIndex === index) {
            break;
          }
          const action = newActions[currentIndex];
          const maxAddable = 100 - action.frequency;
          const addable = Math.min(maxAddable, remainingFrequency);
          action.frequency += addable;
          remainingFrequency -= addable;
          currentIndex++;
        }
      } else {
        // Distribute the excess frequency without going below 0%
        remainingFrequency = Math.abs(remainingFrequency);
        let currentIndex = index + 1;
        while (remainingFrequency > 0) {
          if (currentIndex >= newActions.length) {
            currentIndex = 0;
          }
          if (currentIndex === index) {
            break;
          }
          const action = newActions[currentIndex];
          const maxReducible = action.frequency;
          const reducible = Math.min(maxReducible, remainingFrequency);
          action.frequency -= reducible;
          remainingFrequency -= reducible;
          currentIndex++;
        }
      }
    }

    // Ensure no negative frequencies
    newActions.forEach((action) => {
      if (action.frequency < 0) action.frequency = 0;
    });

    onActionChange(newActions);
  };

  return (
    <Panel
      sx={{
        padding: 1,
        width: '100%',
      }}
    >
      <Box
        sx={{
          gap: 1,
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        {actions.map((action, index) => (
          <Box key={index} sx={{ flex: 1 }}>
            <ActionComponent
              initialAction={action}
              onChange={(updatedAction) => handleActionChange(index, updatedAction)}
            />
          </Box>
        ))}
      </Box>
    </Panel>
  );
};

export default ActionList;
