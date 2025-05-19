import Form from './form';
import { getRangeConfigForm, RangeControls, InitialValue } from '../../utils/form-utils';

type RangeFormProps = {
  onSubmit: (data: RangeControls) => void;
  initialValues?: InitialValue<RangeControls>;
};

const RangeForm = ({ onSubmit, initialValues = {} }: RangeFormProps) => {
  const config = getRangeConfigForm({ initialValues });

  return <Form config={config} onSubmit={onSubmit} />;
};

export default RangeForm; 