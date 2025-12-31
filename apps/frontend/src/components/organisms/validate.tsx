// React
import { useEffect } from 'react';

// External libraries
import { useSearchParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';

// Store
import { validate } from '../../store/slices/user-slice';

// Constants
import { FetchStatus } from '../../constants';

// Hooks
import useUser from '../../hooks/useUser';

const Validate = () => {
  // Get token from query params
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [dispatch, { status, error }] = useUser();

  useEffect(() => {
    dispatch(validate(token));
  }, [dispatch, token]);

  const message =
    status === FetchStatus.SUCCEDED
      ? 'Email succesfully validated!'
      : !!error
      ? `Error: ${error as string}`
      : '';

  return (
    <Typography variant="h6" color="primary" align="center">
      {message}
    </Typography>
  );
};

export default Validate;
