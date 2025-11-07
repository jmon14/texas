import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { FetchStatus } from '../../constants';
import { AxiosError } from 'axios';
import { RootState } from '../store';
import { scenariosApi } from '../../api/api';
import {
  ScenarioResponseDto,
  GetScenariosGameTypeEnum,
  GetScenariosDifficultyEnum,
  GetScenariosCategoryEnum,
} from '../../../backend-api/api';

// Scenario state structure
export type ScenarioState = {
  error: unknown;
  status: FetchStatus;
  currentScenario: ScenarioResponseDto | null;
  scenarios: ScenarioResponseDto[];
};

// Initial state on load
const initialState: ScenarioState = {
  status: FetchStatus.IDDLE,
  currentScenario: null,
  error: null,
  scenarios: [],
};

// Async thunk for fetching all scenarios
export const fetchScenarios = createAsyncThunk(
  'scenario/fetchAll',
  async (
    filters: {
      gameType?: GetScenariosGameTypeEnum;
      difficulty?: GetScenariosDifficultyEnum;
      category?: GetScenariosCategoryEnum;
    } = {},
    { rejectWithValue },
  ) => {
    try {
      const response = await scenariosApi.getScenarios(
        filters?.gameType,
        filters?.difficulty,
        filters?.category,
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch scenarios');
    }
  },
);

// Async thunk for getting scenario by id
export const fetchScenarioById = createAsyncThunk(
  'scenario/getById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await scenariosApi.getScenarioById(id);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to get scenario');
    }
  },
);

// Async thunk for getting scenarios by category
export const fetchScenariosByCategory = createAsyncThunk(
  'scenario/getByCategory',
  async (category: string, { rejectWithValue }) => {
    try {
      const response = await scenariosApi.getScenariosByCategory(category);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to get scenarios by category',
      );
    }
  },
);

// Loading reducer
const loadingReducer = (state: ScenarioState) => {
  state.status = FetchStatus.LOADING;
};

// Rejected reducer
const rejectedReducer = (state: ScenarioState, action: PayloadAction<unknown>) => {
  state.status = FetchStatus.FAILED;
  state.error = action.payload;
};

// Scenario reducer
const scenarioReducer = (state: ScenarioState, action: PayloadAction<ScenarioResponseDto>) => {
  state.status = FetchStatus.SUCCEDED;
  state.currentScenario = action.payload;
  state.error = null;
};

// Scenarios reducer
const scenariosReducer = (state: ScenarioState, action: PayloadAction<ScenarioResponseDto[]>) => {
  state.status = FetchStatus.SUCCEDED;
  state.scenarios = action.payload;
  state.error = null;
};

// Slice for scenario related data
export const scenarioSlice = createSlice({
  name: 'scenario',
  initialState,
  reducers: {
    setCurrentScenario: (state, action: PayloadAction<ScenarioResponseDto | null>) => {
      state.currentScenario = action.payload;
    },
    clearState: (state) => {
      state.error = null;
      state.status = FetchStatus.IDDLE;
    },
  },
  extraReducers(builder) {
    builder
      // Fetch scenarios
      .addCase(fetchScenarios.pending, loadingReducer)
      .addCase(fetchScenarios.rejected, rejectedReducer)
      .addCase(fetchScenarios.fulfilled, scenariosReducer)
      // Get scenario by id
      .addCase(fetchScenarioById.pending, loadingReducer)
      .addCase(fetchScenarioById.rejected, rejectedReducer)
      .addCase(fetchScenarioById.fulfilled, scenarioReducer)
      // Get scenarios by category
      .addCase(fetchScenariosByCategory.pending, loadingReducer)
      .addCase(fetchScenariosByCategory.rejected, rejectedReducer)
      .addCase(fetchScenariosByCategory.fulfilled, scenariosReducer);
  },
});

export const { setCurrentScenario, clearState } = scenarioSlice.actions;

export const selectScenario = (state: RootState) => state.scenario;

export default scenarioSlice.reducer;
