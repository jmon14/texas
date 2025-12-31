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

/**
 * Props for the Login component
 * @interface LoginProps
 */
type LoginProps = {
  /** Optional initial form values for email and password fields */
  initialValues?: InitialValue<LoginControls>;
};

/**
 * Login component - User authentication form with email and password.
 *
 * Provides a complete login interface with form validation, error handling,
 * and navigation links to registration and password reset. Integrates with
 * Redux for authentication state management. Shows loading states and error
 * messages from the authentication API.
 *
 * @component
 * @example
 * ```tsx
 * Basic usage in auth route
 * <Route path="/auth/login" element={<Login />} />
 * ```
 *
 * @example
 * With initial values (e.g., for testing)
 * ```tsx
 * <Login
 *   initialValues={{
 *     email: 'test@example.com',
 *     password: 'password123'
 *   }}
 * />
 * ```
 *
 * @example
 * In auth layout
 * ```tsx
 * <AuthLayout title="Sign In">
 *   <Login />
 * </AuthLayout>
 * ```
 *
 * @param {LoginProps} props - The component props
 * @param {Object} [props.initialValues] - Initial form field values
 * @returns {JSX.Element} Rendered login form with navigation links
 *
 * @remarks
 * Features:
 * - Email and password validation
 * - Shows error messages from failed login attempts
 * - Links to registration page for new users
 * - Link to password reset page
 * - Loading state during authentication
 * - Automatic redirect to home on successful login
 */
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
