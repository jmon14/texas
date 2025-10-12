// External libraries
import { PaletteMode } from '@mui/material';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const THEME_STORAGE_KEY = 'theme';

type ThemeState = {
  mode: PaletteMode;
};

const initialState: ThemeState = {
  mode: (localStorage.getItem(THEME_STORAGE_KEY) as PaletteMode) || 'light',
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState: initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<PaletteMode>) => {
      state.mode = action.payload;
      localStorage.setItem(THEME_STORAGE_KEY, action.payload);
    },
  },
});

export const { setTheme } = themeSlice.actions;

export default themeSlice.reducer;
