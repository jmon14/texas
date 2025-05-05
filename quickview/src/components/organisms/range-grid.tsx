import { useTheme } from '@mui/material';
import { Range } from '../../../vision-api';
import RangeCell from '../molecules/range-cell';
import Panel from '../atoms/panel';

type RangeGridProps = {
  range: Range;
  onCellClick?: (index: number) => void;
};

const RangeGrid = ({ range, onCellClick }: RangeGridProps) => {
  const theme = useTheme();
  const rangeCardinality = Math.sqrt(range.handsRange.length);

  const spacing = theme.spacing(0.5);

  return (
    <Panel
      sx={{
        padding: 1,
        height: '100%',
        display: 'grid',
        gridTemplateColumns: `repeat(${rangeCardinality}, 1fr)`,
        aspectRatio: '1.2',
        gridGap: spacing,
      }}
    >
      {range.handsRange.map(({ rangeFraction, actions, label }, index) => (
        <RangeCell 
          key={index} 
          rangeFraction={rangeFraction} 
          actions={actions} 
          label={label}
          onClick={() => onCellClick?.(index)}
        />
      ))}
    </Panel>
  );
};

export default RangeGrid;
