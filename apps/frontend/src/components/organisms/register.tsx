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

type RegisterProps = {
  initialValues?: InitialValue<RegisterControls>;
};

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
