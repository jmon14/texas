import { useEffect, useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import {
  ScenarioResponseDtoCategoryEnum,
  ScenarioResponseDtoGameTypeEnum,
  ScenarioResponseDtoDifficultyEnum,
} from '../../../backend-api/api';
import { useAppSelector, useAppDispatch } from '../../hooks/store-hooks';
import { fetchScenarios, selectScenario } from '../../store/slices/scenario-slice';
import { FetchStatus } from '../../constants';
import ScenarioCard from '../molecules/scenario-card';

/**
 * Styled container for filter sections
 */
const StyledFiltersContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

/**
 * Styled wrapper for individual filter section
 */
const StyledFilterSection = styled(Box)({});

/**
 * Styled container for filter chips with wrapping
 */
const StyledFilterChips = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  flexWrap: 'wrap',
}));

/**
 * ScenarioList component - Browse and filter poker training scenarios.
 *
 * Displays a filterable grid of poker scenarios with three filter dimensions:
 * - Game Type (Cash, Tournament)
 * - Difficulty (Beginner, Intermediate, Advanced)
 * - Category (Opening Ranges, 3-Betting, Defending BB, Calling Ranges)
 *
 * Fetches all scenarios on mount and performs client-side filtering for instant
 * response. Shows loading states, error states, and empty states. Each scenario
 * card is clickable and navigates to the scenario detail page.
 *
 * @component
 * @example
 * ```tsx
 * Basic usage in route
 * <Route path="/scenarios" element={<ScenarioList />} />
 * ```
 *
 * @example
 * In a page with header
 * ```tsx
 * function ScenariosPage() {
 *   return (
 *     <Container>
 *       <Typography variant="h3">Training Scenarios</Typography>
 *       <ScenarioList />
 *     </Container>
 *   );
 * }
 * ```
 *
 * @returns {JSX.Element} Rendered scenario list with filters and card grid
 *
 * @remarks
 * Key features:
 * - Fetches all scenarios once on mount
 * - Client-side filtering with useMemo for performance
 * - Toggle filters by clicking chips (click again to clear)
 * - Multiple filters work with AND logic (must match all selected)
 * - Responsive grid layout (12 cols on xs, 6 on sm, 4 on md+)
 * - Loading spinner during fetch
 * - Error alert on fetch failure
 * - Empty state when no scenarios match filters
 *
 * Filter behavior:
 * - Default: All filters cleared (shows all scenarios)
 * - Click a chip: Apply that filter
 * - Click same chip again: Clear that filter
 * - Multiple filters: Results must match ALL selected filters
 */
const ScenarioList = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { scenarios, status, error } = useAppSelector(selectScenario);

  const [gameTypeFilter, setGameTypeFilter] = useState<ScenarioResponseDtoGameTypeEnum | undefined>(
    undefined,
  );
  const [difficultyFilter, setDifficultyFilter] = useState<
    ScenarioResponseDtoDifficultyEnum | undefined
  >(undefined);
  const [categoryFilter, setCategoryFilter] = useState<ScenarioResponseDtoCategoryEnum | undefined>(
    undefined,
  );

  // Fetch scenarios on mount (fetch all, filter client-side)
  useEffect(() => {
    dispatch(fetchScenarios({}));
  }, [dispatch]);

  // Client-side filtering (as per requirements)
  const filteredScenarios = useMemo(() => {
    return scenarios.filter((scenario) => {
      if (gameTypeFilter && scenario.gameType !== gameTypeFilter) return false;
      if (difficultyFilter && scenario.difficulty !== difficultyFilter) return false;
      if (categoryFilter && scenario.category !== categoryFilter) return false;
      return true;
    });
  }, [scenarios, gameTypeFilter, difficultyFilter, categoryFilter]);

  const handleScenarioClick = (scenarioId: string) => {
    navigate(`/scenarios/${scenarioId}`);
  };

  const handleGameTypeFilter = (gameType: ScenarioResponseDtoGameTypeEnum | undefined) => {
    setGameTypeFilter(gameType === gameTypeFilter ? undefined : gameType);
  };

  const handleDifficultyFilter = (difficulty: ScenarioResponseDtoDifficultyEnum | undefined) => {
    setDifficultyFilter(difficulty === difficultyFilter ? undefined : difficulty);
  };

  const handleCategoryFilter = (category: ScenarioResponseDtoCategoryEnum | undefined) => {
    setCategoryFilter(category === categoryFilter ? undefined : category);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Scenario Browser
      </Typography>

      {/* Filters */}
      <StyledFiltersContainer>
        <StyledFilterSection>
          <Typography variant="subtitle2" gutterBottom>
            Game Type
          </Typography>
          <StyledFilterChips>
            <Chip
              label="All"
              onClick={() => handleGameTypeFilter(undefined)}
              color={gameTypeFilter === undefined ? 'primary' : 'default'}
              variant={gameTypeFilter === undefined ? 'filled' : 'outlined'}
            />
            <Chip
              label="Cash"
              onClick={() => handleGameTypeFilter(ScenarioResponseDtoGameTypeEnum.Cash)}
              color={
                gameTypeFilter === ScenarioResponseDtoGameTypeEnum.Cash ? 'primary' : 'default'
              }
              variant={
                gameTypeFilter === ScenarioResponseDtoGameTypeEnum.Cash ? 'filled' : 'outlined'
              }
            />
            <Chip
              label="Tournament"
              onClick={() => handleGameTypeFilter(ScenarioResponseDtoGameTypeEnum.Tournament)}
              color={
                gameTypeFilter === ScenarioResponseDtoGameTypeEnum.Tournament
                  ? 'primary'
                  : 'default'
              }
              variant={
                gameTypeFilter === ScenarioResponseDtoGameTypeEnum.Tournament
                  ? 'filled'
                  : 'outlined'
              }
            />
          </StyledFilterChips>
        </StyledFilterSection>

        <StyledFilterSection>
          <Typography variant="subtitle2" gutterBottom>
            Difficulty
          </Typography>
          <StyledFilterChips>
            <Chip
              label="All"
              onClick={() => handleDifficultyFilter(undefined)}
              color={difficultyFilter === undefined ? 'primary' : 'default'}
              variant={difficultyFilter === undefined ? 'filled' : 'outlined'}
            />
            <Chip
              label="Beginner"
              onClick={() => handleDifficultyFilter(ScenarioResponseDtoDifficultyEnum.Beginner)}
              color={
                difficultyFilter === ScenarioResponseDtoDifficultyEnum.Beginner
                  ? 'primary'
                  : 'default'
              }
              variant={
                difficultyFilter === ScenarioResponseDtoDifficultyEnum.Beginner
                  ? 'filled'
                  : 'outlined'
              }
            />
            <Chip
              label="Intermediate"
              onClick={() => handleDifficultyFilter(ScenarioResponseDtoDifficultyEnum.Intermediate)}
              color={
                difficultyFilter === ScenarioResponseDtoDifficultyEnum.Intermediate
                  ? 'primary'
                  : 'default'
              }
              variant={
                difficultyFilter === ScenarioResponseDtoDifficultyEnum.Intermediate
                  ? 'filled'
                  : 'outlined'
              }
            />
            <Chip
              label="Advanced"
              onClick={() => handleDifficultyFilter(ScenarioResponseDtoDifficultyEnum.Advanced)}
              color={
                difficultyFilter === ScenarioResponseDtoDifficultyEnum.Advanced
                  ? 'primary'
                  : 'default'
              }
              variant={
                difficultyFilter === ScenarioResponseDtoDifficultyEnum.Advanced
                  ? 'filled'
                  : 'outlined'
              }
            />
          </StyledFilterChips>
        </StyledFilterSection>

        <StyledFilterSection>
          <Typography variant="subtitle2" gutterBottom>
            Category
          </Typography>
          <StyledFilterChips>
            <Chip
              label="All"
              onClick={() => handleCategoryFilter(undefined)}
              color={categoryFilter === undefined ? 'primary' : 'default'}
              variant={categoryFilter === undefined ? 'filled' : 'outlined'}
            />
            <Chip
              label={ScenarioResponseDtoCategoryEnum.OpeningRanges}
              onClick={() => handleCategoryFilter(ScenarioResponseDtoCategoryEnum.OpeningRanges)}
              color={
                categoryFilter === ScenarioResponseDtoCategoryEnum.OpeningRanges
                  ? 'primary'
                  : 'default'
              }
              variant={
                categoryFilter === ScenarioResponseDtoCategoryEnum.OpeningRanges
                  ? 'filled'
                  : 'outlined'
              }
            />
            <Chip
              label={ScenarioResponseDtoCategoryEnum._3Betting}
              onClick={() => handleCategoryFilter(ScenarioResponseDtoCategoryEnum._3Betting)}
              color={
                categoryFilter === ScenarioResponseDtoCategoryEnum._3Betting ? 'primary' : 'default'
              }
              variant={
                categoryFilter === ScenarioResponseDtoCategoryEnum._3Betting ? 'filled' : 'outlined'
              }
            />
            <Chip
              label={ScenarioResponseDtoCategoryEnum.DefendingBb}
              onClick={() => handleCategoryFilter(ScenarioResponseDtoCategoryEnum.DefendingBb)}
              color={
                categoryFilter === ScenarioResponseDtoCategoryEnum.DefendingBb
                  ? 'primary'
                  : 'default'
              }
              variant={
                categoryFilter === ScenarioResponseDtoCategoryEnum.DefendingBb
                  ? 'filled'
                  : 'outlined'
              }
            />
            <Chip
              label={ScenarioResponseDtoCategoryEnum.CallingRanges}
              onClick={() => handleCategoryFilter(ScenarioResponseDtoCategoryEnum.CallingRanges)}
              color={
                categoryFilter === ScenarioResponseDtoCategoryEnum.CallingRanges
                  ? 'primary'
                  : 'default'
              }
              variant={
                categoryFilter === ScenarioResponseDtoCategoryEnum.CallingRanges
                  ? 'filled'
                  : 'outlined'
              }
            />
          </StyledFilterChips>
        </StyledFilterSection>
      </StyledFiltersContainer>

      {/* Loading State */}
      {status === FetchStatus.LOADING && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {status === FetchStatus.FAILED && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error ? String(error) : 'Failed to load scenarios'}
        </Alert>
      )}

      {/* Scenarios Grid */}
      {status === FetchStatus.SUCCEDED && (
        <>
          {filteredScenarios.length === 0 ? (
            <Typography variant="body1" color="text.secondary">
              No scenarios found matching your filters.
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {filteredScenarios.map((scenario) => (
                <Grid item xs={12} sm={6} md={4} key={scenario._id}>
                  <ScenarioCard
                    scenario={scenario}
                    onClick={() => handleScenarioClick(scenario._id)}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Box>
  );
};

ScenarioList.displayName = 'ScenarioList';

export default ScenarioList;
