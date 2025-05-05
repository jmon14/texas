// External libraries
import { SubmitHandler } from 'react-hook-form';

// Store
import { reset } from '../../store/slices/user-slice';

// Components
import Form from './form';

// Hooks
import useUser from '../../hooks/useUser';

// Utils
import { getResetConfigForm, InitialValue, ResetControls } from '../../utils/form-utils';

type ResetProps = {
  initialValues?: InitialValue<ResetControls>;
};

const ResetPassword = ({ initialValues }: ResetProps) => {
  const [dispatch, { error, status }] = useUser();

  // Handle submition of form
  const onSubmit: SubmitHandler<ResetControls> = (data) => {
    dispatch(reset(data.email));
  };

  // Get reset config form
  const config = getResetConfigForm({ error, status, initialValues });

  return <Form noValidate config={config} onSubmit={onSubmit} />;
};

export default ResetPassword;
