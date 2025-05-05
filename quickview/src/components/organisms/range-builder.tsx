import { Box } from '@mui/material';

import { defaultHandRange } from '../../constants';
import { Action, ActionTypeEnum, Range } from '../../../vision-api';
import RangeGrid from './range-grid';
import ActionList from './action-list';

const RangeBuilder = () => {
  const range: Range = {
    name: 'UTG',
    handsRange: defaultHandRange,
  };

  const actions: Action[] = [
    { type: ActionTypeEnum.Fold, percentage: 50 },
    { type: ActionTypeEnum.Call, percentage: 30 },
    { type: ActionTypeEnum.Raise, percentage: 20 },
  ];

  const handleActionChange = (actions: Action[]) => {
    console.log(actions);
  };

  return (
    <Box sx={{ display: 'flex', gap: 3, height: '100%', alignItems: 'flex-start' }}>
      <RangeGrid range={range}></RangeGrid>
      <ActionList initialActions={actions} onActionChange={handleActionChange}></ActionList>
    </Box>
  );
};

export default RangeBuilder;
