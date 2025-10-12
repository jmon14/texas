import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './store-hooks';
import { clearState } from '../store/slices/range-slice';

const useRange = () => {
  const dispatch = useAppDispatch();
  const rangeState = useAppSelector((state) => state.range);

  useEffect(() => {
    return () => {
      dispatch(clearState());
    };
  }, [dispatch]);

  return [dispatch, rangeState] as const;
};

export default useRange;
