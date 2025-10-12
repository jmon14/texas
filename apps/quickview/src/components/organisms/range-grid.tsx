import { useTheme } from '@mui/material';
import { useState, useCallback, useEffect } from 'react';
import { RangeResponseDto } from '../../../ultron-api/api';
import RangeCell from '../molecules/range-cell';
import Panel from '../atoms/panel';

type RangeGridProps = {
  range: Partial<RangeResponseDto>;
  onCellClick?: (index: number) => void;
  onCellsSelect?: (indices: number[]) => void;
};

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
      {range.handsRange?.map(({ rangeFraction, actions, label }, index) => (
        <RangeCell
          key={index}
          rangeFraction={rangeFraction}
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
