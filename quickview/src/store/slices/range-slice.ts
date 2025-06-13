import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Range } from '../../../vision-api';
import { FetchStatus } from '../../constants';
import { AxiosError } from 'axios';
import { RootState } from '../store';
import { rangeApi } from '../../api/api';

// Range state structure
export type RangeState = {
  error: unknown;
  status: FetchStatus;
  currentRange: Range | null; // TODO - Either commit to state here or in the range builder
  ranges: Range[];
};

// Initial state on load
const initialState: RangeState = {
  status: FetchStatus.IDDLE,
  currentRange: null,
  error: null,
  ranges: [],
};

// Async thunk for creating range
export const createRange = createAsyncThunk(
  'range/create',
  async (range: Omit<Range, 'id'>, { rejectWithValue }) => {
    try {
      await rangeApi.createRange(range);
      // After successful creation, fetch the updated ranges
      const response = await rangeApi.getRangesByUserId(range.userId);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create range');
    }
  },
);

// Async thunk for getting range by id
export const getRangeById = createAsyncThunk(
  'range/getById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await rangeApi.getRangeById(id);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to get range');
    }
  },
);

// Async thunk for updating range
export const updateRange = createAsyncThunk(
  'range/update',
  async (
    { id, range, userId }: { id: string; range: Range; userId: string },
    { rejectWithValue },
  ) => {
    try {
      await rangeApi.updateRange(id, range);
      // After successful update, fetch the updated ranges
      const response = await rangeApi.getRangesByUserId(userId);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update range');
    }
  },
);

// Async thunk for deleting range
export const deleteRange = createAsyncThunk(
  'range/delete',
  async ({ id, userId }: { id: string; userId: string }, { rejectWithValue }) => {
    try {
      await rangeApi.deleteRange(id);
      // After successful deletion, fetch the updated ranges
      const response = await rangeApi.getRangesByUserId(userId);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete range');
    }
  },
);

// Async thunk for getting ranges by user id
export const getRangesByUserId = createAsyncThunk(
  'range/getByUserId',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await rangeApi.getRangesByUserId(userId);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to get ranges');
    }
  },
);

// Loading reducer
const loadingReducer = (state: RangeState) => {
  state.status = FetchStatus.LOADING;
};

// Rejected reducer
const rejectedReducer = (state: RangeState, action: PayloadAction<unknown>) => {
  state.status = FetchStatus.FAILED;
  state.error = action.payload;
};

// Range reducer
const rangeReducer = (state: RangeState, action: PayloadAction<Range>) => {
  state.status = FetchStatus.SUCCEDED;
  state.currentRange = action.payload;
  state.error = null;
};

// Ranges reducer
const rangesReducer = (state: RangeState, action: PayloadAction<Range[]>) => {
  state.status = FetchStatus.SUCCEDED;
  state.ranges = action.payload;
  state.error = null;
};

// Slice for range related data
export const rangeSlice = createSlice({
  name: 'range',
  initialState,
  reducers: {
    setCurrentRange: (state, action) => {
      state.currentRange = action.payload;
    },
    clearState: (state) => {
      state.error = null;
      state.status = FetchStatus.IDDLE;
    },
  },
  extraReducers(builder) {
    builder
      // Create range
      .addCase(createRange.pending, loadingReducer)
      .addCase(createRange.rejected, rejectedReducer)
      .addCase(createRange.fulfilled, rangesReducer)
      // Get range by id
      .addCase(getRangeById.pending, loadingReducer)
      .addCase(getRangeById.rejected, rejectedReducer)
      .addCase(getRangeById.fulfilled, rangeReducer)
      // Update range
      .addCase(updateRange.pending, loadingReducer)
      .addCase(updateRange.rejected, rejectedReducer)
      .addCase(updateRange.fulfilled, rangesReducer)
      // Delete range
      .addCase(deleteRange.pending, loadingReducer)
      .addCase(deleteRange.rejected, rejectedReducer)
      .addCase(deleteRange.fulfilled, rangesReducer)
      // Get ranges by user id
      .addCase(getRangesByUserId.pending, loadingReducer)
      .addCase(getRangesByUserId.rejected, rejectedReducer)
      .addCase(getRangesByUserId.fulfilled, rangesReducer);
  },
});

export const { setCurrentRange, clearState } = rangeSlice.actions;

export const selectRange = (state: RootState) => state.range;

export default rangeSlice.reducer;
