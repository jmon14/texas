// External libraries
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';
import { SubmitHandler } from 'react-hook-form';

// Store
import { signup } from '../../store/slices/user-slice';

// Components
import Form, { useFormMethods } from './form';

// Hooks
import useUser from '../../hooks/useUser';

// Utils
import { getRegisterConfigForm, InitialValue, RegisterControls } from '../../utils/form-utils';

/**
 * Props for the Register component
 * @interface RegisterProps
 */
type RegisterProps = {
  /** Optional initial form values for registration fields */
  initialValues?: InitialValue<RegisterControls>;
};

/**
 * Register component - User registration form for new account creation.
 *
 * Provides a complete registration interface with form validation, error handling,
 * and navigation link to login. Integrates with Redux for user signup and state
 * management. Includes fields for email, username, password, and password confirmation.
 * Shows loading states and error messages from the registration API.
 *
 * @component
 * @example
 * ```tsx
 * Basic usage in auth route
 * <Route path="/auth/register" element={<Register />} />
 * ```
 *
 * @example
 * With initial values (e.g., for testing)
 * ```tsx
 * <Register
 *   initialValues={{
 *     email: 'test@example.com',
 *     username: 'testuser',
 *     password: 'password123',
 *     passwordConfirmation: 'password123'
 *   }}
 * />
 * ```
 *
 * @example
 * In auth layout
 * ```tsx
 * <AuthLayout title="Create Account">
 *   <Register />
 * </AuthLayout>
 * ```
 *
 * @param {RegisterProps} props - The component props
 * @param {Object} [props.initialValues] - Initial form field values
 * @returns {JSX.Element} Rendered registration form with navigation link
 *
 * @remarks
 * Features:
 * - Email, username, and password validation
 * - Password confirmation matching
 * - Shows error messages from failed registration attempts
 * - Link to login page for existing users
 * - Loading state during account creation
 * - Automatic redirect to validation page on successful signup
 * - Requires email verification after registration
 */
const Register = ({ initialValues }: RegisterProps) => {
  const [dispatch, { error, status }] = useUser();

  // Get register form configuration
  const config = getRegisterConfigForm({ error, initialValues, status });

  // Initialize form methods
  const methods = useFormMethods<RegisterControls>(config);

  // Handle submit of register form
  const onSubmit: SubmitHandler<RegisterControls> = async (data) => {
    dispatch(signup(data));
  };

  return (
    <Form noValidate config={config} onSubmit={onSubmit} methods={methods}>
      <Box sx={{ display: 'flex', gap: '5px' }}>
        <Typography>
          Already registered?{' '}
          <Link component={RouterLink} to="/auth/login">
            Sign in
          </Link>
        </Typography>
      </Box>
    </Form>
  );
};

export default Register;
