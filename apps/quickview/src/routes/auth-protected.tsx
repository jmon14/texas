// React
import { useEffect, useState } from 'react';

// External libraries
import { Navigate, Outlet } from 'react-router-dom';

// Store
import { useAppDispatch, useAppSelector } from '../hooks/store-hooks';
import { refresh, setUser } from '../store/slices/user-slice';

type Props = {
  redirectPath: string;
  refreshCookie?: string;
  shouldBeLogged: boolean;
};

export const AuthProtected = ({ refreshCookie, redirectPath, shouldBeLogged }: Props) => {
  // Keep track of refresh attempt
  const [refreshAttemped, setRefreshAttempted] = useState(!refreshCookie ? true : false);

  // Redux store
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  // Attempt to refresh token on load, redirect if not valid
  useEffect(() => {
    if (refreshCookie) {
      dispatch(refresh())
        .unwrap()
        .then((data) => dispatch(setUser(data)))
        .finally(() => setRefreshAttempted(true));
    }
  }, [dispatch, refreshCookie]);

  const condition = shouldBeLogged ? !!user : !user && refreshAttemped;

  return condition ? (
    <Outlet />
  ) : refreshAttemped ? (
    <Navigate to={redirectPath} />
  ) : (
    <div>Loading...</div> // TODO - Create loading page
  );
};
