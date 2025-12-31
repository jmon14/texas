import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';
import { ScenarioResponseDto } from '../../../backend-api/api';
import DifficultyBadge from '../atoms/difficulty-badge';

/**
 * Styled Card with hover elevation effect
 */
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

/**
 * Props for the ScenarioCard component
 * @interface ScenarioCardProps
 */
type ScenarioCardProps = {
  /** Poker scenario data including name, description, difficulty, position, etc. */
  scenario: ScenarioResponseDto;
  /** Callback when card is clicked */
  onClick: () => void;
};

/**
 * ScenarioCard component for displaying poker scenario information in a card format.
 *
 * Shows scenario details including name, description, difficulty badge, category chip,
 * position matchup, and effective stack size. Card has hover elevation effect and is
 * fully clickable via CardActionArea. Uses styled components for consistent layout.
 *
 * @component
 * @example
 * ```tsx
 * Basic usage
 * <ScenarioCard
 *   scenario={{
 *     name: '3-Bet from BTN',
 *     description: 'Defending against 3-bet from button',
 *     difficulty: 'Medium',
 *     category: 'Preflop',
 *     position: 'CO',
 *     vsPosition: 'BTN',
 *     effectiveStack: 100
 *   }}
 *   onClick={() => navigate('/scenarios/123')}
 * />
 * ```
 *
 * @example
 * In a grid layout
 * ```tsx
 * <Grid container spacing={3}>
 *   {scenarios.map((scenario) => (
 *     <Grid item xs={12} sm={6} md={4} key={scenario.id}>
 *       <ScenarioCard
 *         scenario={scenario}
 *         onClick={() => handleScenarioClick(scenario.id)}
 *       />
 *     </Grid>
 *   ))}
 * </Grid>
 * ```
 *
 * @example
 * With difficulty filtering
 * ```tsx
 * {filteredScenarios.map((scenario) => (
 *   <ScenarioCard
 *     key={scenario.id}
 *     scenario={scenario}
 *     onClick={() => openScenarioDetails(scenario)}
 *   />
 * ))}
 * ```
 *
 * @param {ScenarioCardProps} props - The component props
 * @param {ScenarioResponseDto} props.scenario - Scenario data
 * @param {Function} props.onClick - Card click handler
 * @returns {JSX.Element} Rendered scenario card with all information
 */
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
