import { Box, Tooltip } from '@mui/material';

import Cell, { CellProps } from '../atoms/cell';
import { ActionColor } from '../../constants';

type RangeCellProps = CellProps & {
  onClick?: () => void;
  onMouseDown?: () => void;
  onMouseEnter?: () => void;
  isSelected?: boolean;
};

const RangeCell = ({ onClick, onMouseDown, onMouseEnter, isSelected, ...props }: RangeCellProps) => {
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
      onMouseEnter={onMouseEnter}
    >
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
                    {action.type} {action.percentage}%
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            ''
          )
        }
      >
        <Cell 
          {...props} 
          onClick={onClick}
        />
      </Tooltip>
    </Box>
  );
};

export default RangeCell;
