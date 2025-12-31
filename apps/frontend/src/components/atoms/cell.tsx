import { forwardRef } from 'react';
import Box from '@mui/material/Box';
import { styled, useTheme } from '@mui/material/styles';
import { blueGrey } from '@mui/material/colors';
import { HandRangeDto } from '../../../backend-api/api';
import { ActionColor } from '../../constants';

const Cell = styled(Box)(({ theme }) => ({
  height: '100%',
  cursor: 'pointer',
  overflow: 'hidden',
  position: 'relative',
  borderRadius: '4px',
  boxShadow: theme.shadows[1],
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.grey[600],
}));

/**
 * Props for the Cell component
 * @interface CellProps
 * @extends {React.DOMAttributes<Element>}
 * @extends {HandRangeDto}
 */
export type CellProps = React.DOMAttributes<Element> &
  HandRangeDto & {
    /** Optional click handler for cell interactions */
    onClick?: () => void;
  };

/**
 * Cell component for displaying poker hand ranges with visual action frequencies.
 *
 * Displays a poker hand (e.g., "AA", "KK") with a visual representation of action frequencies
 * (bet, call, fold, etc.) shown as colored bars. The height of the bar represents the
 * carryover frequency (0-100%).
 *
 * @component
 * @example
 * ```tsx
 * <DummyCell
 *   label="AA"
 *   carryoverFrequency={75}
 *   actions={[
 *     { type: 'Raise', frequency: 60 },
 *     { type: 'Call', frequency: 40 }
 *   ]}
 *   onClick={() => {}}
 * />
 * ```
 *
 * @param {CellProps} props - The component props
 * @param {number} props.carryoverFrequency - Frequency percentage (0-100) for visual bar height
 * @param {ActionDto[]} props.actions - Array of actions with type and frequency
 * @param {string} props.label - Hand label to display (e.g., "AA", "AKs")
 * @param {Function} [props.onMouseOver] - Mouse over event handler
 * @param {Function} [props.onMouseLeave] - Mouse leave event handler
 * @param {Function} [props.onClick] - Click event handler
 * @returns {JSX.Element} Rendered cell component
 */
const DummyCell = forwardRef(
  ({ carryoverFrequency, actions, label, onMouseOver, onMouseLeave, onClick }: CellProps, ref) => {
    const theme = useTheme();
    // Convert carryoverFrequency (0-100) to height percentage (0-1)
    const heightPercentage = carryoverFrequency / 100;

    return (
      <Cell onMouseOver={onMouseOver} onMouseLeave={onMouseLeave} onClick={onClick} ref={ref}>
        <Box sx={{ position: 'absolute', top: '8px', left: '8px', zIndex: 1 }}>{label}</Box>
        <Box
          sx={{
            display: 'flex',
            height: heightPercentage,
            width: '100%',
            bottom: '0px',
            position: 'absolute',
            backgroundColor: theme.palette.mode === 'light' ? blueGrey[100] : blueGrey[800],
          }}
        >
          {actions?.map((action, index) => (
            <Box
              key={index}
              sx={{
                height: '100%',
                width: `${action.frequency}%`,
                backgroundColor: ActionColor[action.type],
              }}
            />
          ))}
        </Box>
      </Cell>
    );
  },
);

DummyCell.displayName = 'DummyCell';

export default DummyCell;
