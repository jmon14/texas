import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { useState } from 'react';

import Cell, { CellProps } from '../atoms/cell';
import { ActionColor } from '../../constants';

/**
 * Props for the RangeCell component
 * @interface RangeCellProps
 * @extends {CellProps}
 */
type RangeCellProps = CellProps & {
  /** Callback when cell is clicked */
  onClick?: () => void;
  /** Callback when mouse button is pressed down on cell */
  onMouseDown?: () => void;
  /** Callback when mouse enters cell area */
  onMouseEnter?: () => void;
  /** Whether the cell is currently selected */
  isSelected?: boolean;
  /** Whether the cell is being dragged */
  isDragging?: boolean;
};

/**
 * RangeCell component for interactive poker hand range selection with tooltips.
 *
 * Wraps the Cell component with additional interactivity including hover tooltips,
 * selection state visualization, and drag-and-drop support. Shows action frequencies
 * in a tooltip on hover (unless dragging). Displays a primary-colored outline when selected.
 *
 * @component
 * @example
 * ```tsx
 * Basic usage with actions
 * <RangeCell
 *   label="AA"
 *   carryoverFrequency={100}
 *   actions={[
 *     { type: 'Raise', frequency: 80 },
 *     { type: 'Call', frequency: 20 }
 *   ]}
 *   onClick={() => {}}
 * />
 * ```
 *
 * @example
 * With selection state
 * ```tsx
 * <RangeCell
 *   label="KK"
 *   carryoverFrequency={90}
 *   actions={actions}
 *   isSelected={true}
 *   onClick={handleCellClick}
 * />
 * ```
 *
 * @example
 * Drag and drop support
 * ```tsx
 * <RangeCell
 *   label="AKs"
 *   carryoverFrequency={75}
 *   actions={actions}
 *   onMouseDown={handleDragStart}
 *   onMouseEnter={handleDragOver}
 *   isDragging={isDragging}
 * />
 * ```
 *
 * @param {RangeCellProps} props - The component props
 * @param {Function} [props.onClick] - Cell click handler
 * @param {Function} [props.onMouseDown] - Mouse down handler for drag start
 * @param {Function} [props.onMouseEnter] - Mouse enter handler for drag over
 * @param {boolean} [props.isSelected] - Selection state
 * @param {boolean} [props.isDragging] - Dragging state (hides tooltip)
 * @returns {JSX.Element} Rendered interactive range cell component
 */
const RangeCell = ({
  onClick,
  onMouseDown,
  onMouseEnter,
  isSelected,
  isDragging,
  ...props
}: RangeCellProps) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <Box
      sx={{
        height: '100%',
        position: 'relative',
        ...(isSelected && {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: '-1px',
        }),
      }}
      onMouseDown={onMouseDown}
      onMouseEnter={() => {
        setIsHovering(true);
        onMouseEnter?.();
      }}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Tooltip
        arrow
        placement="top"
        open={isHovering && !isDragging}
        title={
          props.actions.length > 0 ? (
            <Box>
              {props.actions.map((action, index) => (
                <Box
                  key={index}
                  sx={{
                    gap: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Box
                    component="span"
                    sx={{ backgroundColor: ActionColor[action.type], width: '5px', height: '5px' }}
                  />
                  <Box component="span">
                    {action.type} {action.frequency}%
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            ''
          )
        }
      >
        <Cell {...props} onClick={onClick} />
      </Tooltip>
    </Box>
  );
};

export default RangeCell;
