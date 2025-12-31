import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  styled,
} from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import { ArrowBack, PlayArrow } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../hooks/store-hooks';
import { fetchScenarioById, selectScenario } from '../../store/slices/scenario-slice';
import { FetchStatus } from '../../constants';
import DifficultyBadge from '../atoms/difficulty-badge';
import { ScenarioResponseDtoActionTypeEnum, PreviousActionDto } from '../../../backend-api/api';

// Internal styled components
const StyledHeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const StyledTagsBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  flexWrap: 'wrap',
}));

const ScenarioDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentScenario, status, error } = useAppSelector(selectScenario);

  useEffect(() => {
    if (id) {
      dispatch(fetchScenarioById(id));
    }
  }, [dispatch, id]);

  const handleBack = () => {
    navigate('/scenarios');
  };

  const BackButton = ({ sx }: { sx?: SxProps<Theme> }) => (
    <Button startIcon={<ArrowBack />} onClick={handleBack} sx={sx}>
      Back to Scenarios
    </Button>
  );

  const formatActionType = (actionType: ScenarioResponseDtoActionTypeEnum): string => {
    switch (actionType) {
      case ScenarioResponseDtoActionTypeEnum.Open:
        return 'Open';
      case ScenarioResponseDtoActionTypeEnum.VsOpenCall:
        return 'vs Open Call';
      case ScenarioResponseDtoActionTypeEnum.VsOpen3bet:
        return 'vs Open 3-Bet';
      case ScenarioResponseDtoActionTypeEnum.Vs3bet:
        return 'vs 3-Bet';
      case ScenarioResponseDtoActionTypeEnum.Vs4bet:
        return 'vs 4-Bet';
      default:
        return actionType;
    }
  };

  const formatPreviousAction = (action: PreviousActionDto): string => {
    const position = action.position;
    const actionType = action.actionType;
    const sizing = action.sizing ? ` ${action.sizing}bb` : '';
    return `${position}: ${actionType}${sizing}`;
  };

  if (status === FetchStatus.LOADING) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (status === FetchStatus.FAILED || !currentScenario) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error ? String(error) : 'Failed to load scenario'}
        </Alert>
        <BackButton />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <BackButton sx={{ mb: 3 }} />

      <Paper sx={{ p: 3 }}>
        <StyledHeaderBox>
          <Typography variant="h4" component="h1">
            {currentScenario.name}
          </Typography>
          <DifficultyBadge difficulty={currentScenario.difficulty} />
        </StyledHeaderBox>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {currentScenario.description}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Category
            </Typography>
            <Chip label={currentScenario.category} variant="outlined" />
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Scenario Details
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2">
                <strong>Street:</strong> {currentScenario.street}
              </Typography>
              <Typography variant="body2">
                <strong>Game Type:</strong> {currentScenario.gameType}
              </Typography>
              <Typography variant="body2">
                <strong>Position:</strong> {currentScenario.position} vs{' '}
                {currentScenario.vsPosition}
              </Typography>
              <Typography variant="body2">
                <strong>Action:</strong> {formatActionType(currentScenario.actionType)}
              </Typography>
              <Typography variant="body2">
                <strong>Effective Stack:</strong> {currentScenario.effectiveStack}bb
              </Typography>
              {currentScenario.betSize && (
                <Typography variant="body2">
                  <strong>Bet Size:</strong> {currentScenario.betSize}bb
                </Typography>
              )}
            </Box>
          </Box>

          {currentScenario.previousActions && currentScenario.previousActions.length > 0 && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Previous Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {currentScenario.previousActions.map((action, index) => (
                  <Typography key={index} variant="body2">
                    {formatPreviousAction(action)}
                  </Typography>
                ))}
              </Box>
            </Box>
          )}

          {currentScenario.boardTexture && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Board Texture
              </Typography>
              <Chip label={currentScenario.boardTexture} variant="outlined" />
            </Box>
          )}

          {currentScenario.tags && currentScenario.tags.length > 0 && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Tags
              </Typography>
              <StyledTagsBox>
                {currentScenario.tags.map((tag, index) => (
                  <Chip key={index} label={tag} size="small" variant="outlined" />
                ))}
              </StyledTagsBox>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        <Button
          variant="contained"
          startIcon={<PlayArrow />}
          disabled
          fullWidth
          title="Coming in Phase 4"
        >
          Start Practice
        </Button>
      </Paper>
    </Box>
  );
};

ScenarioDetail.displayName = 'ScenarioDetail';

export default ScenarioDetail;
