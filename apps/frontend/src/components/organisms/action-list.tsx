import Box from '@mui/material/Box';
import { ActionDto } from '../../../backend-api/api';
import ActionComponent from '../molecules/action';
import Panel from '../atoms/panel';

type ActionListProps = {
  actions: ActionDto[];
  onActionChange: (actions: ActionDto[]) => void;
};

const ActionList = ({ actions, onActionChange }: ActionListProps) => {
  const handleActionChange = (index: number, updatedAction: ActionDto) => {
    // Create a new array with new instances of the objects
    const newActions = actions.map((action, i) => (i === index ? updatedAction : { ...action }));

    // Calculate the total frequency
    const totalFrequency = newActions.reduce((sum, action) => sum + action.frequency, 0);

    if (totalFrequency !== 100) {
      let remainingFrequency = 100 - totalFrequency;

      if (remainingFrequency > 0) {
        // Distribute the remaining frequency without exceeding 100%
        let currentIndex = index + 1;
        while (remainingFrequency > 0) {
          if (currentIndex >= newActions.length) {
            currentIndex = 0;
          }
          if (currentIndex === index) {
            break;
          }
          const action = newActions[currentIndex];
          const maxAddable = 100 - action.frequency;
          const addable = Math.min(maxAddable, remainingFrequency);
          action.frequency += addable;
          remainingFrequency -= addable;
          currentIndex++;
        }
      } else {
        // Distribute the excess frequency without going below 0%
        remainingFrequency = Math.abs(remainingFrequency);
        let currentIndex = index + 1;
        while (remainingFrequency > 0) {
          if (currentIndex >= newActions.length) {
            currentIndex = 0;
          }
          if (currentIndex === index) {
            break;
          }
          const action = newActions[currentIndex];
          const maxReducible = action.frequency;
          const reducible = Math.min(maxReducible, remainingFrequency);
          action.frequency -= reducible;
          remainingFrequency -= reducible;
          currentIndex++;
        }
      }
    }

    // Ensure no negative frequencies
    newActions.forEach((action) => {
      if (action.frequency < 0) action.frequency = 0;
    });

    onActionChange(newActions);
  };

  return (
    <Panel
      sx={{
        padding: 1,
        width: '100%',
      }}
    >
      <Box
        sx={{
          gap: 1,
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        {actions.map((action, index) => (
          <Box key={index} sx={{ flex: 1 }}>
            <ActionComponent
              initialAction={action}
              onChange={(updatedAction) => handleActionChange(index, updatedAction)}
            />
          </Box>
        ))}
      </Box>
    </Panel>
  );
};

export default ActionList;
