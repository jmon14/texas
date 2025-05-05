import { Box, Tooltip } from '@mui/material';

import Cell, { CellProps } from '../atoms/cell';
import { ActionColor } from '../../constants';

const RangeCell = (props: CellProps) => {
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
      <Cell {...props} />
    </Tooltip>
  );
};

export default RangeCell;
