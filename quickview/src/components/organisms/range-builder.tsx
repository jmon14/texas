import { useState } from 'react';
import { Box } from '@mui/material';

import { defaultHandRange } from '../../constants';
import { Action, ActionTypeEnum, Range } from '../../../vision-api';
import RangeGrid from './range-grid';
import ActionList from './action-list';

const RangeBuilder = () => {
  const [range, setRange] = useState<Range>({
    name: 'UTG',
    handsRange: defaultHandRange,
  });

  const [actions, setActions] = useState<Action[]>([
    { type: ActionTypeEnum.Fold, percentage: 50 },
    { type: ActionTypeEnum.Call, percentage: 30 },
    { type: ActionTypeEnum.Raise, percentage: 20 },
  ]);

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
