import { SubmitHandler } from 'react-hook-form';
import { selectRange } from '../../store/slices/range-slice';
import Form, { useFormMethods } from './form';
import { getRangeConfigForm, InitialValue, RangeControls } from '../../utils/form-utils';
import { useAppSelector } from '../../hooks/store-hooks';
import { useEffect } from 'react';

type RangeFormProps = {
  initialValues?: InitialValue<RangeControls>;
  onSubmit?: SubmitHandler<RangeControls>;
  onNameChange?: (name: string) => void;
};

const RangeForm = ({ initialValues, onSubmit, onNameChange }: RangeFormProps) => {
  const { status, error } = useAppSelector(selectRange);
  const config = getRangeConfigForm({ error, initialValues, status });
  const methods = useFormMethods<RangeControls>(config);

  // Watch for name changes and notify parent
  useEffect(() => {
    const subscription = methods.watch((value) => {
      if (value.name && onNameChange) {
        onNameChange(value.name);
      }
    });
    return () => subscription.unsubscribe();
  }, [methods, onNameChange]);

  // Update form value when initialValues changes, but only if it's different
  useEffect(() => {
    if (initialValues?.name && initialValues.name !== methods.getValues('name')) {
      methods.setValue('name', initialValues.name);
    }
  }, [initialValues, methods]);

  const handleRangeSubmit: SubmitHandler<RangeControls> = (data) => {
    if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <Form config={config} methods={methods} onSubmit={handleRangeSubmit} />
  );
};

export default RangeForm; 