import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';
import { ScenarioResponseDto } from '../../../backend-api/api';
import DifficultyBadge from '../atoms/difficulty-badge';

// Internal styled components
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'elevation 0.2s',
  '&:hover': {
    boxShadow: theme.shadows[6],
  },
}));

const StyledCardActionArea = styled(CardActionArea)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
});

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

const StyledHeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
}));

const StyledMetadataBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  flexWrap: 'wrap',
  marginTop: theme.spacing(1),
}));

type ScenarioCardProps = {
  scenario: ScenarioResponseDto;
  onClick: () => void;
};

const ScenarioCard = ({ scenario, onClick }: ScenarioCardProps) => {
  return (
    <StyledCard>
      <StyledCardActionArea onClick={onClick}>
        <StyledCardContent>
          <StyledHeaderBox>
            <Typography variant="h6" component="h3" sx={{ flex: 1 }}>
              {scenario.name}
            </Typography>
            <DifficultyBadge difficulty={scenario.difficulty} />
          </StyledHeaderBox>
          <Typography variant="body2" color="text.secondary">
            {scenario.description}
          </Typography>
          <StyledMetadataBox>
            <Chip label={scenario.category} size="small" variant="outlined" />
            <Typography variant="caption" color="text.secondary">
              {scenario.position} vs {scenario.vsPosition}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {scenario.effectiveStack}bb
            </Typography>
          </StyledMetadataBox>
        </StyledCardContent>
      </StyledCardActionArea>
    </StyledCard>
  );
};

ScenarioCard.displayName = 'ScenarioCard';

export default ScenarioCard;
