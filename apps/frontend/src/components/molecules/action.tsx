import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
import { debounce } from '@mui/material/utils';
import { ActionDto } from '../../../backend-api/api';
import { ActionColor } from '../../constants';
import { blueGrey, grey } from '@mui/material/colors';

/**
 * Styled TextField for action frequency input with custom styling
 */
const ActionTextField = styled(TextField)(() => ({
  '& input': {
    padding: '0px',
    textAlign: 'center',
  },
  '&.MuiTextField-root': {
    borderRadius: '4px',
  },
  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'purple',
  },
}));

/**
 * Props for the Action component
 * @interface ActionProps
 */
type ActionProps = {
  /** Initial action data with type and frequency */
  initialAction: ActionDto;
  /** Optional custom color (unused in current implementation) */
  color?: string;
  /** Callback when action frequency changes (debounced by 300ms) */
  onChange: (updatedAction: ActionDto) => void;
};

/**
 * Action component for editing poker action frequencies with validation.
 *
 * Displays an action type (Raise, Call, Fold, etc.) with an editable frequency
 * input field. Background color corresponds to action type. Validates frequency
 * input to be between 0-100%, handles invalid numbers gracefully, and debounces
 * changes by 300ms to reduce unnecessary updates.
 *
 * @component
 * @example
 * ```tsx
 * Basic usage with raise action
 * <ActionComponent
 *   initialAction={{ type: 'Raise', frequency: 60 }}
 *   onChange={(updated) => {}}
 * />
 * ```
 *
 * @example
 * Multiple actions in poker range editor
 * ```tsx
 * {actions.map((action, index) => (
 *   <ActionComponent
 *     key={index}
 *     initialAction={action}
 *     onChange={(updated) => handleActionChange(index, updated)}
 *   />
 * ))}
 * ```
 *
 * @example
 * With form validation
 * ```tsx
 * <ActionComponent
 *   initialAction={{ type: 'Call', frequency: 40 }}
 *   onChange={(updated) => {
 *     if (updated.frequency >= 0 && updated.frequency <= 100) {
 *       updateAction(updated);
 *     }
 *   }}
 * />
 * ```
 *
 * @param {ActionProps} props - The component props
 * @param {ActionDto} props.initialAction - Initial action with type and frequency
 * @param {Function} props.onChange - Change handler (debounced 300ms)
 * @returns {JSX.Element} Rendered action editor component
 */
const ActionComponent = ({ initialAction, onChange }: ActionProps) => {
  const theme = useTheme();
  const [action, setAction] = useState(initialAction);
  const [frequency, setFrequency] = useState(action.frequency.toString());

  useEffect(() => {
    setAction(initialAction);
    setFrequency(initialAction.frequency.toString());
  }, [initialAction]);

  const handleFrequencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newFrequency = parseFloat(event.target.value);
    if (isNaN(newFrequency)) {
      setFrequency(event.target.value);
      debouncedOnChange({ ...action, frequency: 0 });
      return;
    }
    if (newFrequency > 100) {
      newFrequency = 100;
    } else if (newFrequency < 0) {
      newFrequency = 0;
    }
    setFrequency(newFrequency.toString());
    debouncedOnChange({ ...action, frequency: newFrequency });
  };

  const debouncedOnChange = useMemo(() => debounce(onChange, 300), [onChange]);

  return (
    <Box
      sx={{
        backgroundColor: ActionColor[action.type],
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: 2,
        borderRadius: 1,
        display: 'flex',
        paddingTop: 2,
        gap: 0.5,
      }}
    >
      <Typography color={(theme) => theme.palette.common.white} variant="h5">
        {action.type}
      </Typography>
      <ActionTextField
        size="small"
        value={frequency}
        onChange={handleFrequencyChange}
        sx={{
          width: '40px',
          backgroundColor: theme.palette.mode === 'light' ? grey[100] : blueGrey[800],
        }}
      />
    </Box>
  );
};

export default ActionComponent;
