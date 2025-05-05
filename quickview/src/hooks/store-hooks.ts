// React
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

// Store
import { RootState, AppDispatch } from '../store/store';

// Use custom dispatch and selector
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
