// External libraries
import { Box, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { SubmitHandler } from 'react-hook-form';

// Store
import { login } from '../../store/slices/user-slice';

// Components
import Form from './form';

// Hooks
import useUser from '../../hooks/useUser';

// Utils
import { getLoginConfigForm, LoginControls, InitialValue } from '../../utils/form-utils';

type LoginProps = {
  initialValues?: InitialValue<LoginControls>;
};

// Login form component
const Login = ({ initialValues = {} }: LoginProps) => {
  const [dispatch, { error, status }] = useUser();

  // Handle submition of form
  const onSubmit: SubmitHandler<LoginControls> = (data) => {
    dispatch(login(data));
  };

  // Get login form configuration
  const config = getLoginConfigForm({ error, initialValues, status });

  // If user logs in succesfully navigate to home
  return (
    <Form noValidate config={config} onSubmit={onSubmit}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body1">
          Don&apos;t have an account?{' '}
          <Link component={RouterLink} to="/auth/register">
            Sign up
          </Link>
        </Typography>
        <Link variant="body1" component={RouterLink} to="/auth/reset">
          Forgot your password?
        </Link>
      </Box>
    </Form>
  );
};

export default Login;
