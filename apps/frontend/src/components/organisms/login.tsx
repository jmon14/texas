// External libraries
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';
import { SubmitHandler } from 'react-hook-form';

// Store
import { login } from '../../store/slices/user-slice';

// Components
import Form, { useFormMethods } from './form';

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

  // Get login form configuration
  const config = getLoginConfigForm({ error, initialValues, status });

  // Initialize form methods
  const methods = useFormMethods<LoginControls>(config);

  // Handle submition of form
  const onSubmit: SubmitHandler<LoginControls> = (data) => {
    dispatch(login(data));
  };

  // If user logs in succesfully navigate to home
  return (
    <Form noValidate config={config} onSubmit={onSubmit} methods={methods}>
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
