// External libraries
import { Box, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { SubmitHandler } from 'react-hook-form';

// Store
import { signup } from '../../store/slices/user-slice';

// Components
import Form from './form';

// Hooks
import useUser from '../../hooks/useUser';

// Utils
import { getRegisterConfigForm, InitialValue, RegisterControls } from '../../utils/form-utils';

type RegisterProps = {
  initialValues?: InitialValue<RegisterControls>;
};

const Register = ({ initialValues }: RegisterProps) => {
  const [dispatch, { error, status }] = useUser();

  // Handle submit of register form
  const onSubmit: SubmitHandler<RegisterControls> = async (data) => {
    dispatch(signup(data));
  };

  // Get register form configuration
  const config = getRegisterConfigForm({ error, initialValues, status });

  return (
    <Form noValidate config={config} onSubmit={onSubmit}>
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
