import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { SubmitHandler } from 'react-hook-form';

import { defaultActions, defaultHandRange } from '../../constants';
import { ActionDto, RangeResponseDto } from '../../../ultron-api/api';
import RangeGrid from './range-grid';
import ActionList from './action-list';
import RangeForm from './range-form';
import { useAppSelector, useAppDispatch } from '../../hooks/store-hooks';
import { selectAuthenticatedUser } from '../../store/slices/user-slice';
import {
  createRange,
  deleteRange,
  getRangesByUserId,
  selectRange,
  updateRange,
} from '../../store/slices/range-slice';
import RangeSelector from './range-selector';
import { RangeControls } from '../../utils/form-utils';

const RangeBuilder = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthenticatedUser);
  const { ranges } = useAppSelector(selectRange);

  const defaultRange: Partial<RangeResponseDto> = {
    name: 'Default Range',
    handsRange: defaultHandRange,
    userId: user.uuid,
    _id: undefined,
  };

  const [range, setRange] = useState<Partial<RangeResponseDto>>(defaultRange);

  const [actions, setActions] = useState<ActionDto[]>(defaultActions);

  useEffect(() => {
    dispatch(getRangesByUserId(user.uuid));
  }, [dispatch, user.uuid]);

  const handleActionChange = (updatedActions: ActionDto[]) => {
    setActions(updatedActions);
  };

  const handleCellClick = (cellIndex: number) => {
    if (!range.handsRange) return;
    const updatedHandsRange = [...range.handsRange];
    updatedHandsRange[cellIndex] = {
      ...updatedHandsRange[cellIndex],
      actions: [...actions],
    };
    setRange({ ...range, handsRange: updatedHandsRange });
  };

  const handleCellsSelect = (indices: number[]) => {
    if (!range.handsRange) return;
    const updatedHandsRange = [...range.handsRange];
    indices.forEach((index) => {
      updatedHandsRange[index] = {
        ...updatedHandsRange[index],
        actions: [...actions],
      };
    });
    setRange({ ...range, handsRange: updatedHandsRange });
  };

  const handleRangeSubmit: SubmitHandler<RangeControls> = (data) => {
    if (range._id && range.handsRange) {
      const rangeToUpdate: Omit<RangeResponseDto, '_id'> = {
        name: data.name,
        handsRange: range.handsRange,
        userId: user.uuid,
      };
      dispatch(
        updateRange({
          id: range._id,
          range: rangeToUpdate,
          userId: user.uuid,
        }),
      );
    } else {
      // Check if user has reached the limit of 10 ranges
      if (ranges.length >= 10) {
        return; // Don't submit if limit reached
      }
      const newRangeData = { ...data, userId: user.uuid, handsRange: range.handsRange || [] };
      dispatch(createRange(newRangeData)).then((action) => {
        if (action.meta.requestStatus === 'fulfilled' && Array.isArray(action.payload)) {
          const newRanges = action.payload as RangeResponseDto[];
          const newRange = newRanges.find(
            (r) => r.name === newRangeData.name && r.userId === newRangeData.userId,
          );
          if (newRange) {
            setRange(newRange);
          }
        }
      });
    }
  };

  const handleRangeSelectChange = (rangeId: string) => {
    const range = ranges.find((range) => range._id === rangeId);
    if (range) {
      setRange(range);
    } else {
      setRange(defaultRange);
    }
  };

  const handleRangeNameChange = (name: string) => {
    setRange((prev) => ({ ...prev, name }));
  };

  const handleRangeDelete = () => {
    if (range._id) {
      dispatch(deleteRange({ id: range._id, userId: user.uuid }));
      setRange(defaultRange);
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 3, height: '100%', alignItems: 'flex-start' }}>
      <RangeGrid range={range} onCellClick={handleCellClick} onCellsSelect={handleCellsSelect} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
        <ActionList actions={actions} onActionChange={handleActionChange} />
        <RangeSelector
          initialValues={{ selectedRangeId: range._id }}
          onRangeSelectChange={(rangeId) => handleRangeSelectChange(rangeId)}
        />
        <RangeForm
          id={range._id}
          initialValues={{ name: range.name }}
          onSubmit={handleRangeSubmit}
          onDelete={handleRangeDelete}
          onNameChange={handleRangeNameChange}
          disabled={!range._id && ranges.length >= 10}
        />
        {!range._id && ranges.length >= 10 && (
          <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
            You have reached the maximum limit of 10 ranges. Delete a range to create a new one.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default RangeBuilder;
