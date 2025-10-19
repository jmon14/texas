// External libraries
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

// Interface
import { LoginDto, ResetPwdDto, RegisterDto, UserEntity } from '../../../backend-api/api';

// Constants
import { FetchStatus } from '../../constants';

// Store
import { RootState } from '../store';

// API
import { authApi, userApi } from '../../api/api';

// User state structure
export type UserState = {
  error: unknown;
  status: FetchStatus;
  user: UserEntity | undefined;
  resendVerificationStatus: FetchStatus;
  resendVerificationError: unknown;
  resetPasswordStatus: FetchStatus;
  resetPasswordError: unknown;
};

// Initial state on load
const initialState: UserState = {
  status: FetchStatus.IDDLE,
  user: undefined,
  error: null,
  resendVerificationStatus: FetchStatus.IDDLE,
  resendVerificationError: null,
  resetPasswordStatus: FetchStatus.IDDLE,
  resetPasswordError: null,
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

// Async thunk for resending verification email
export const resendVerification = createAsyncThunk(
  'accountManager/resendVerification',
  async (email: string, { rejectWithValue }) => {
    try {
      await authApi.resendVerificationEmail({ email });
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
  async (credentials: RegisterDto, { rejectWithValue }) => {
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

// Resend verification specific reducers
const resendVerificationLoadingReducer = (state: UserState) => {
  state.resendVerificationStatus = FetchStatus.LOADING;
  state.resendVerificationError = null;
};

const resendVerificationRejectedReducer = (state: UserState, action: PayloadAction<unknown>) => {
  state.resendVerificationStatus = FetchStatus.FAILED;
  state.resendVerificationError = action.payload;
};

const resendVerificationFulfillReducer = (state: UserState) => {
  state.resendVerificationStatus = FetchStatus.SUCCEDED;
  state.resendVerificationError = null;
};

// Reset password specific reducers
const resetPasswordLoadingReducer = (state: UserState) => {
  state.resetPasswordStatus = FetchStatus.LOADING;
  state.resetPasswordError = null;
};

const resetPasswordRejectedReducer = (state: UserState, action: PayloadAction<unknown>) => {
  state.resetPasswordStatus = FetchStatus.FAILED;
  state.resetPasswordError = action.payload;
};

const resetPasswordFulfillReducer = (state: UserState) => {
  state.resetPasswordStatus = FetchStatus.SUCCEDED;
  state.resetPasswordError = null;
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
      .addCase(reset.pending, resetPasswordLoadingReducer)
      .addCase(resendVerification.pending, resendVerificationLoadingReducer)
      .addCase(signup.pending, loadingReducer)
      .addCase(validate.pending, loadingReducer)
      .addCase(login.rejected, rejectedReducer)
      .addCase(logout.rejected, rejectedReducer)
      .addCase(signup.rejected, rejectedReducer)
      .addCase(validate.rejected, rejectedReducer)
      .addCase(newPassword.rejected, rejectedReducer)
      .addCase(reset.rejected, resetPasswordRejectedReducer)
      .addCase(resendVerification.rejected, resendVerificationRejectedReducer)
      .addCase(login.fulfilled, userReducer)
      .addCase(logout.fulfilled, userReducer)
      .addCase(signup.fulfilled, userReducer)
      .addCase(reset.fulfilled, resetPasswordFulfillReducer)
      .addCase(resendVerification.fulfilled, resendVerificationFulfillReducer)
      .addCase(validate.fulfilled, fulfillReducer)
      .addCase(newPassword.fulfilled, fulfillReducer);
  },
});

export const { setUser, clearState } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;
export const selectAuthenticatedUser = (state: RootState): UserEntity => {
  const user = state.user.user;
  if (!user) {
    throw new Error('User must be authenticated to access this resource');
  }
  return user;
};

export default userSlice.reducer;
