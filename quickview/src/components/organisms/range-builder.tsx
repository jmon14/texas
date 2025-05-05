import { useState } from 'react';
import { Box } from '@mui/material';

import { defaultActions, defaultHandRange } from '../../constants';
import { Action, Range } from '../../../vision-api';
import RangeGrid from './range-grid';
import ActionList from './action-list';

const RangeBuilder = () => {
  const [range, setRange] = useState<Range>({
    name: 'UTG',
    handsRange: defaultHandRange,
  });

  const [actions, setActions] = useState<Action[]>(defaultActions);

  const handleActionChange = (updatedActions: Action[]) => {
    setActions(updatedActions);
  };

  const handleCellClick = (cellIndex: number) => {
    const updatedHandsRange = [...range.handsRange];
    updatedHandsRange[cellIndex] = {
      ...updatedHandsRange[cellIndex],
      actions: [...actions],
    };
    setRange({ ...range, handsRange: updatedHandsRange });
  };

  return (
    <Box sx={{ display: 'flex', gap: 3, height: '100%', alignItems: 'flex-start' }}>
      <RangeGrid range={range} onCellClick={handleCellClick} />
      <ActionList actions={actions} onActionChange={handleActionChange} />
    </Box>
  );
};

export default RangeBuilder;
