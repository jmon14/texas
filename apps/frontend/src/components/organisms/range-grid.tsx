import { useTheme } from '@mui/material/styles';
import { useState, useCallback, useEffect } from 'react';
import { RangeResponseDto } from '../../../backend-api/api';
import RangeCell from '../molecules/range-cell';
import Panel from '../atoms/panel';

/**
 * Props for the RangeGrid component
 * @interface RangeGridProps
 */
type RangeGridProps = {
  /** Poker range data with hands and action frequencies */
  range: Partial<RangeResponseDto>;
  /** Callback when a single cell is clicked */
  onCellClick?: (index: number) => void;
  /** Callback when multiple cells are selected via drag */
  onCellsSelect?: (indices: number[]) => void;
};

/**
 * RangeGrid component - Interactive 13x13 poker hand range grid with drag selection.
 *
 * Displays a grid of poker hands (AA, KK, AK, etc.) with visual action frequency
 * indicators. Supports both single-click and drag-to-select interactions. Shows
 * selection highlights during drag operations and calls appropriate callbacks when
 * selection is complete. Grid size is automatically calculated from the range data.
 *
 * @component
 * @example
 * ```tsx
 * Basic usage with click handler
 * <RangeGrid
 *   range={currentRange}
 *   onCellClick={(index) => applyActionsToCell(index)}
 * />
 * ```
 *
 * @example
 * With drag selection
 * ```tsx
 * <RangeGrid
 *   range={currentRange}
 *   onCellClick={(index) => handleSingleCell(index)}
 *   onCellsSelect={(indices) => handleMultipleCells(indices)}
 * />
 * ```
 *
 * @example
 * In range builder
 * ```tsx
 * <RangeGrid
 *   range={range}
 *   onCellClick={handleCellClick}
 *   onCellsSelect={handleCellsSelect}
 * />
 * ```
 *
 * @param {RangeGridProps} props - The component props
 * @param {Partial<RangeResponseDto>} props.range - Range data with hands
 * @param {Function} [props.onCellClick] - Single cell click handler
 * @param {Function} [props.onCellsSelect] - Multiple cells selection handler
 * @returns {JSX.Element} Rendered 13x13 poker range grid
 *
 * @remarks
 * Interaction modes:
 * - **Click** - Triggers onCellClick with cell index
 * - **Drag** - Hold mouse down and drag across cells, triggers onCellsSelect with array of indices
 * - **Selection** - Visual highlight during drag operation
 * - **Global mouse up** - Listens for mouse up anywhere to complete selection
 *
 * Grid layout:
 * - Dynamically sized based on range.handsRange.length (typically 169 cells = 13x13)
 * - Aspect ratio 1.2 for optimal display
 * - Responsive spacing from theme
 * - User selection disabled to prevent text selection during drag
 */
const RangeGrid = ({ range, onCellClick, onCellsSelect }: RangeGridProps) => {
  const theme = useTheme();
  const rangeCardinality = Math.sqrt(range.handsRange?.length || 0);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [selectedCells, setSelectedCells] = useState<Set<number>>(new Set());

  const spacing = theme.spacing(0.5);

  // Reset selection when mouse is released outside
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isMouseDown) {
        setIsMouseDown(false);
        onCellsSelect?.(Array.from(selectedCells));
        setSelectedCells(new Set());
      }
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isMouseDown, selectedCells, onCellsSelect]);

  const handleMouseDown = useCallback((index: number) => {
    setIsMouseDown(true);
    setSelectedCells(new Set([index]));
  }, []);

  const handleMouseEnter = useCallback(
    (index: number) => {
      if (isMouseDown) {
        setSelectedCells((prev) => new Set([...Array.from(prev), index]));
      }
    },
    [isMouseDown],
  );

  return (
    <Panel
      sx={{
        padding: 1,
        height: '100%',
        display: 'grid',
        gridTemplateColumns: `repeat(${rangeCardinality}, 1fr)`,
        aspectRatio: '1.2',
        gridGap: spacing,
        userSelect: 'none', // Prevent text selection during drag
      }}
    >
      {range.handsRange?.map(({ carryoverFrequency, actions, label }, index) => (
        <RangeCell
          key={index}
          carryoverFrequency={carryoverFrequency}
          actions={actions}
          label={label}
          onClick={() => onCellClick?.(index)}
          onMouseDown={() => handleMouseDown(index)}
          onMouseEnter={() => handleMouseEnter(index)}
          isSelected={selectedCells.has(index)}
          isDragging={isMouseDown}
        />
      ))}
    </Panel>
  );
};

export default RangeGrid;
