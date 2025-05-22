import { useState } from 'react';
import { Box } from '@mui/material';

import { defaultActions, defaultHandRange } from '../../constants';
import { Action, Range } from '../../../vision-api';
import RangeGrid from './range-grid';
import ActionList from './action-list';
import RangeForm from './range-form';
import useRange from '../../hooks/useRange';
import { createRange } from '../../store/slices/range-slice';
import { useAppSelector } from '../../hooks/store-hooks';
import { selectAuthenticatedUser } from '../../store/slices/user-slice';

const RangeBuilder = () => {
  const user = useAppSelector(selectAuthenticatedUser);
  const [range, setRange] = useState<Range>({
    name: 'UTG',
    handsRange: defaultHandRange,
    userId: user.uuid,
  });

  const [actions, setActions] = useState<Action[]>(defaultActions);
  const [dispatch] = useRange();

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

  const handleCellsSelect = (indices: number[]) => {
    const updatedHandsRange = [...range.handsRange];
    indices.forEach(index => {
      updatedHandsRange[index] = {
        ...updatedHandsRange[index],
        actions: [...actions],
      };
    });
    setRange({ ...range, handsRange: updatedHandsRange });
  };

  const handleRangeSubmit = (data: { name: string }) => {
    const updatedRange = {
      ...range,
      name: data.name,
    };
    setRange(updatedRange);
    dispatch(createRange(updatedRange));
  };

  return (
    <Box sx={{ display: 'flex', gap: 3, height: '100%', alignItems: 'flex-start' }}>
      <RangeGrid 
        range={range} 
        onCellClick={handleCellClick}
        onCellsSelect={handleCellsSelect}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
        <ActionList actions={actions} onActionChange={handleActionChange} />
        <RangeForm 
          onSubmit={handleRangeSubmit} 
          initialValues={{ name: range.name }}
        />
      </Box>
    </Box>
  );
};

export default RangeBuilder;
