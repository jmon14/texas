import Chip, { ChipProps } from '@mui/material/Chip';
import { ScenarioResponseDtoDifficultyEnum } from '../../../backend-api/api';

type DifficultyBadgeProps = {
  difficulty: ScenarioResponseDtoDifficultyEnum;
} & Omit<ChipProps, 'label' | 'color'>;

const DifficultyBadge = ({ difficulty, ...chipProps }: DifficultyBadgeProps) => {
  const getColor = (): 'success' | 'warning' | 'error' => {
    switch (difficulty) {
      case ScenarioResponseDtoDifficultyEnum.Beginner:
        return 'success';
      case ScenarioResponseDtoDifficultyEnum.Intermediate:
        return 'warning';
      case ScenarioResponseDtoDifficultyEnum.Advanced:
        return 'error';
      default:
        return 'success';
    }
  };

  const getLabel = (): string => {
    switch (difficulty) {
      case ScenarioResponseDtoDifficultyEnum.Beginner:
        return 'Beginner';
      case ScenarioResponseDtoDifficultyEnum.Intermediate:
        return 'Intermediate';
      case ScenarioResponseDtoDifficultyEnum.Advanced:
        return 'Advanced';
      default:
        return difficulty;
    }
  };

  return <Chip label={getLabel()} color={getColor()} size="small" {...chipProps} />;
};

DifficultyBadge.displayName = 'DifficultyBadge';

export default DifficultyBadge;
