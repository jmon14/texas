// React
import { useEffect } from 'react';

// Store
import { useAppDispatch, useAppSelector } from './store-hooks';
import { clearState } from '../store/slices/user-slice';

const useUser = () => {
  // Redux store
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.user);

  // Clear error if any
  useEffect(() => {
    return () => {
      dispatch(clearState());
    };
  }, [dispatch]);

  return [dispatch, userState] as const;
};

export default useUser;
