// External libraries
import { SubmitHandler } from 'react-hook-form';

// Store
import { reset } from '../../store/slices/user-slice';

// Components
import Form, { useFormMethods } from './form';

// Hooks
import useUser from '../../hooks/useUser';

// Utils
import { getResetConfigForm, InitialValue, ResetControls } from '../../utils/form-utils';

type ResetProps = {
  initialValues?: InitialValue<ResetControls>;
};

const ResetPassword = ({ initialValues }: ResetProps) => {
  const [dispatch, { error, status }] = useUser();

  // Get reset config form
  const config = getResetConfigForm({ error, status, initialValues });

  // Initialize form methods
  const methods = useFormMethods<ResetControls>(config);

  // Handle submition of form
  const onSubmit: SubmitHandler<ResetControls> = (data) => {
    dispatch(reset(data.email));
  };

  return <Form noValidate config={config} onSubmit={onSubmit} methods={methods} />;
};

export default ResetPassword;
