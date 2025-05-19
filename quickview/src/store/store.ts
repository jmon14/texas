// External libraries
import { combineReducers, configureStore, PreloadedState } from '@reduxjs/toolkit';

// Slices
import userReducer from './slices/user-slice';
import themeReducer from './slices/theme-slice';
import rangeReducer from './slices/range-slice';

// Create the root reducer independently to obtain the RootState type
const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
  range: rangeReducer,
});

export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
};

// Infer the `RootState` and `AppDispatch` types from reducer and setup store
export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
