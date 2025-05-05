import { Box, Tooltip } from '@mui/material';

import Cell, { CellProps } from '../atoms/cell';
import { ActionColor } from '../../constants';

type RangeCellProps = CellProps & {
  onClick?: () => void;
};

const RangeCell = ({ onClick, ...props }: RangeCellProps) => {
  return (
    <Tooltip
      arrow
      placement="top"
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
                  {action.type} {action.percentage * 100}%
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
  );
};

export default RangeCell;
