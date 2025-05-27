import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { UseFormSetValue, UseFormReturn } from 'react-hook-form';

import { defaultActions, defaultHandRange } from '../../constants';
import { Action, Range } from '../../../vision-api';
import RangeGrid from './range-grid';
import ActionList from './action-list';
import RangeForm from './range-form';
import { useAppSelector, useAppDispatch } from '../../hooks/store-hooks';
import { selectAuthenticatedUser } from '../../store/slices/user-slice';
import { createRange, deleteRange, getRangesByUserId, selectRange, updateRange } from '../../store/slices/range-slice';
import RangeSelector from './range-selector';
import { RangeControls, RangeSelectorControls } from '../../utils/form-utils';
import { SubmitHandler } from 'react-hook-form';

const RangeBuilder = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthenticatedUser);
  const { ranges } = useAppSelector(selectRange);

  const defaultRange = {
    name: 'Default Range',
    handsRange: defaultHandRange,
    userId: user.uuid,
    id: undefined
  };

  const [range, setRange] = useState<Range>(defaultRange);

  const [actions, setActions] = useState<Action[]>(defaultActions);

  useEffect(() => {
    dispatch(getRangesByUserId(user.uuid));
  }, [dispatch, user.uuid]);

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

  const handleRangeSubmit: SubmitHandler<RangeControls> = (data) => {
    if (range.id) {
      dispatch(updateRange({ id: range.id, range: { ...range, name: data.name }, userId: user.uuid }));
    } else {
      const newRangeData = { ...data, userId: user.uuid, handsRange: range.handsRange };
      dispatch(createRange(newRangeData)).then((action) => {
        if (action.meta.requestStatus === 'fulfilled') {
          const newRanges = action.payload as Range[];
          const newRange = newRanges.find(r => 
            r.name === newRangeData.name && 
            r.userId === newRangeData.userId
          );
          if (newRange) {
            setRange(newRange);
          }
        }
      });
    }
  };

  const handleRangeSelectChange = (rangeId: string) => {
    const range = ranges.find(range => range.id === rangeId);
    if (range) {
      setRange(range);
    } else {
      setRange(defaultRange);
    }
  };

  const handleRangeNameChange = (name: string) => {
    setRange(prev => ({ ...prev, name }));
  };

  const handleRangeDelete = () => {
    if (range.id) {
      dispatch(deleteRange({ id: range.id, userId: user.uuid }));
      setRange(defaultRange);
    }
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
        <RangeSelector
          initialValues={{ selectedRangeId: range.id }} 
          onRangeSelectChange={(rangeId) => handleRangeSelectChange(rangeId)} 
        />
        <RangeForm 
          id={range.id}
          initialValues={{ name: range.name }} 
          onSubmit={handleRangeSubmit}
          onDelete={handleRangeDelete}
          onNameChange={handleRangeNameChange}
        />
      </Box>
    </Box>
  );
};

export default RangeBuilder;
