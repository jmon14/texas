import { forwardRef } from 'react';
import { Box, styled, useTheme } from '@mui/material';
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

export type CellProps = React.DOMAttributes<Element> &
  HandRangeDto & {
    onClick?: () => void;
  };

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
