import { forwardRef } from 'react';
import { Box, styled, useTheme } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import { HandRange } from '../../../vision-api';
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

export type CellProps = React.DOMAttributes<Element> & HandRange;

const DummyCell = forwardRef(
  ({ rangeFraction: range, actions, label, onMouseOver, onMouseLeave }: CellProps, ref) => {
    const theme = useTheme();

    return (
      <Cell onMouseOver={onMouseOver} onMouseLeave={onMouseLeave} ref={ref}>
        <Box sx={{ position: 'absolute', top: '8px', left: '8px', zIndex: 1 }}>{label}</Box>
        <Box
          sx={{
            display: 'flex',
            height: range,
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
                width: `${action.percentage * 100}%`,
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
