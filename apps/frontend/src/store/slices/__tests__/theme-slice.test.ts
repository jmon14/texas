// Redux
import { configureStore } from '@reduxjs/toolkit';

// Slice
import themeReducer, { setTheme } from '../theme-slice';

// Types
import type { Palette } from '@mui/material/styles';

type PaletteMode = Palette['mode'];

// Helper to create test store
const createTestStore = (preloadedState?: { theme: { mode: PaletteMode } }) => {
  return configureStore({
    reducer: {
      theme: themeReducer,
    },
    preloadedState,
  });
};

describe('theme-slice', () => {
  // Mock localStorage
  const localStorageMock = (() => {
    let store: Record<string, string> = {};

    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString();
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
  })();

  beforeEach(() => {
    // Replace global localStorage with mock
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
    localStorageMock.clear();
  });

  describe('initial state', () => {
    it('should return light mode as default when localStorage is empty', () => {
      const state = themeReducer(undefined, { type: '@@INIT' });
      expect(state).toEqual({
        mode: 'light',
      });
    });

    it('should load mode from localStorage if available', () => {
      localStorageMock.setItem('theme', 'dark');

      // Re-import to get fresh initial state
      jest.resetModules();
      const freshThemeReducer = require('../theme-slice').default;

      const state = freshThemeReducer(undefined, { type: '@@INIT' });
      expect(state.mode).toBe('dark');
    });
  });

  describe('setTheme reducer', () => {
    it('should update mode to dark', () => {
      const initialState = { mode: 'light' as PaletteMode };
      const state = themeReducer(initialState, setTheme('dark'));

      expect(state.mode).toBe('dark');
    });

    it('should update mode to light', () => {
      const initialState = { mode: 'dark' as PaletteMode };
      const state = themeReducer(initialState, setTheme('light'));

      expect(state.mode).toBe('light');
    });

    it('should persist theme to localStorage', () => {
      const store = createTestStore();

      store.dispatch(setTheme('dark'));

      expect(localStorageMock.getItem('theme')).toBe('dark');
    });

    it('should update localStorage when theme changes', () => {
      const store = createTestStore();

      store.dispatch(setTheme('dark'));
      expect(localStorageMock.getItem('theme')).toBe('dark');

      store.dispatch(setTheme('light'));
      expect(localStorageMock.getItem('theme')).toBe('light');
    });
  });

  describe('theme integration', () => {
    it('should maintain theme state across multiple dispatches', () => {
      const store = createTestStore();

      store.dispatch(setTheme('dark'));
      let state = store.getState().theme;
      expect(state.mode).toBe('dark');

      store.dispatch(setTheme('light'));
      state = store.getState().theme;
      expect(state.mode).toBe('light');

      store.dispatch(setTheme('dark'));
      state = store.getState().theme;
      expect(state.mode).toBe('dark');
    });

    it('should toggle between light and dark modes', () => {
      const store = createTestStore();

      const toggleTheme = (currentMode: PaletteMode) => {
        const newMode = currentMode === 'light' ? 'dark' : 'light';
        store.dispatch(setTheme(newMode));
        return newMode;
      };

      let currentMode = store.getState().theme.mode;
      expect(currentMode).toBe('light');

      currentMode = toggleTheme(currentMode);
      expect(store.getState().theme.mode).toBe('dark');

      currentMode = toggleTheme(currentMode);
      expect(store.getState().theme.mode).toBe('light');
    });
  });
});
