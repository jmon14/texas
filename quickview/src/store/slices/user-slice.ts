// External libraries
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

// Interface
import { LoginDto, ResetPwdDto, UserDto, UserEntity } from '../../../ultron-api/api';

// Constants
import { FetchStatus } from '../../constants';

// Store
import { RootState } from '../store';

// API
import { authApi, userApi } from '../../api/api';

// User state structure
type UserState = {
  error: unknown;
  status: FetchStatus;
  user: UserEntity | undefined;
};

// Initial state on load
const initialState: UserState = {
  status: FetchStatus.IDDLE,
  user: undefined,
  error: null,
};

// Async thunk to update password
export const newPassword = createAsyncThunk(
  'accountManager/newPassword',
  async (data: ResetPwdDto, { rejectWithValue }) => {
    try {
      if (!data.token) {
        return rejectWithValue('No token provided');
      }
      await userApi.resetPwd(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
    }
  },
);

// Async thunk for sending reset link to email provided
export const reset = createAsyncThunk(
  'accountManager/reset',
  async (email: string, { rejectWithValue }) => {
    try {
      await authApi.sendResetEmail({ email });
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
    }
  },
);

// Async thunk for validating email
export const validate = createAsyncThunk(
  'accountManager/validate',
  async (token: string, { rejectWithValue }) => {
    try {
      if (!token) {
        return rejectWithValue('No token provided');
      }
      await userApi.confirm({ token });
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data.message);
      }
    }
  },
);

// Async thunk for registering new user
export const signup = createAsyncThunk(
  'accountManager/register',
  async (credentials: UserDto, { rejectWithValue }) => {
    try {
      const user = await userApi.createUser(credentials);
      return user.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
    }
  },
);

// Async thunk for login
export const login = createAsyncThunk(
  'accountManager/login',
  async (credentials: LoginDto, { rejectWithValue }) => {
    try {
      const user = await authApi.login(credentials);
      return user.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
    }
  },
);

// Async thunk for logout
export const logout = createAsyncThunk('accountManager/logout', async (_, { rejectWithValue }) => {
  try {
    await authApi.logout();
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
});

// Async thunk for refreshing the access token
export const refresh = createAsyncThunk(
  'accountManage/refresh',
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const user = await authApi.refresh();
      return fulfillWithValue(user.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data.message);
      }
    }
  },
);

// Loading reducer
const loadingReducer = (state: UserState) => {
  state.status = FetchStatus.LOADING;
};

// Rejected reducer
const rejectedReducer = (state: UserState, action: PayloadAction<unknown>) => {
  state.status = FetchStatus.FAILED;
  state.error = action.payload;
};

// Fulfill reducer
const fulfillReducer = (state: UserState) => {
  state.status = FetchStatus.SUCCEDED;
  state.error = null;
};

// User fetch reducer
const userReducer = (state: UserState, action: PayloadAction<UserEntity | undefined>) => {
  state.status = FetchStatus.SUCCEDED;
  state.user = action.payload;
  state.error = null;
};

// Slice for user related data
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearState: (state) => {
      state.error = null;
      state.status = FetchStatus.IDDLE;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(login.pending, loadingReducer)
      .addCase(reset.pending, loadingReducer)
      .addCase(signup.pending, loadingReducer)
      .addCase(validate.pending, loadingReducer)
      .addCase(login.rejected, rejectedReducer)
      .addCase(logout.rejected, rejectedReducer)
      .addCase(signup.rejected, rejectedReducer)
      .addCase(validate.rejected, rejectedReducer)
      .addCase(newPassword.rejected, rejectedReducer)
      .addCase(reset.rejected, rejectedReducer)
      .addCase(login.fulfilled, userReducer)
      .addCase(logout.fulfilled, userReducer)
      .addCase(signup.fulfilled, userReducer)
      .addCase(reset.fulfilled, fulfillReducer)
      .addCase(validate.fulfilled, fulfillReducer)
      .addCase(newPassword.fulfilled, fulfillReducer);
  },
});

export const { setUser, clearState } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
