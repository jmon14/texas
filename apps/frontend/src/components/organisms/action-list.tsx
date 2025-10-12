import { Box } from '@mui/material';
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

    // Calculate the total percentage
    const totalPercentage = newActions.reduce((sum, action) => sum + action.percentage, 0);

    if (totalPercentage !== 100) {
      let remainingPercentage = 100 - totalPercentage;

      if (remainingPercentage > 0) {
        // Distribute the remaining percentage without exceeding 100%
        let currentIndex = index + 1;
        while (remainingPercentage > 0) {
          if (currentIndex >= newActions.length) {
            currentIndex = 0;
          }
          if (currentIndex === index) {
            break;
          }
          const action = newActions[currentIndex];
          const maxAddable = 100 - action.percentage;
          const addable = Math.min(maxAddable, remainingPercentage);
          action.percentage += addable;
          remainingPercentage -= addable;
          currentIndex++;
        }
      } else {
        // Distribute the excess percentage without going below 0%
        remainingPercentage = Math.abs(remainingPercentage);
        let currentIndex = index + 1;
        while (remainingPercentage > 0) {
          if (currentIndex >= newActions.length) {
            currentIndex = 0;
          }
          if (currentIndex === index) {
            break;
          }
          const action = newActions[currentIndex];
          const maxReducible = action.percentage;
          const reducible = Math.min(maxReducible, remainingPercentage);
          action.percentage -= reducible;
          remainingPercentage -= reducible;
          currentIndex++;
        }
      }
    }

    // Ensure no negative percentages
    newActions.forEach((action) => {
      if (action.percentage < 0) action.percentage = 0;
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
