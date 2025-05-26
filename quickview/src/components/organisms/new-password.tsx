// External libraries
import { useSearchParams } from 'react-router-dom';
import { SubmitHandler } from 'react-hook-form';

// Store
import { newPassword } from '../../store/slices/user-slice';

// Components
import Form, { useFormMethods } from './form';

// Hooks
import useUser from '../../hooks/useUser';

// Utils
import { getNewPwdConfigForm, InitialValue, NewPasswordControls } from '../../utils/form-utils';

type NewPwdProps = {
  initialValues?: InitialValue<NewPasswordControls>;
};

const NewPassword = ({ initialValues = {} }: NewPwdProps) => {
  // Get token from query params
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [dispatch, { error, status }] = useUser();

  // Get login form configuration
  const config = getNewPwdConfigForm({ error, initialValues, status });

  // Initialize form methods
  const methods = useFormMethods<NewPasswordControls>(config);

  // Handle submit of register form
  const onSubmit: SubmitHandler<NewPasswordControls> = (data) => {
    dispatch(newPassword({ password: data.password, token }));
  };

  return <Form noValidate config={config} onSubmit={onSubmit} methods={methods} />;
};

export default NewPassword;
