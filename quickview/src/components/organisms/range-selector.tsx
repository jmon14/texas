// React
import { useEffect } from 'react';

// External libraries
import { SubmitHandler, UseFormSetValue } from 'react-hook-form';

// Store
import { selectRange } from '../../store/slices/range-slice';

// Components
import Form, { useFormMethods } from './form';

// Hooks
import { useAppSelector } from '../../hooks/store-hooks';

// Utils
import {
  getRangeSelectorConfigForm,
  InitialValue,
  RangeSelectorControls,
} from '../../utils/form-utils';

type RangeSelectorProps = {
  initialValues?: InitialValue<RangeSelectorControls>;
  onRangeSelectChange: (rangeId: string) => void;
};

const RangeSelector = ({ initialValues, onRangeSelectChange }: RangeSelectorProps) => {
  const { ranges, error } = useAppSelector(selectRange);

  // Get range selector form configuration with stable options
  const config = getRangeSelectorConfigForm({ error, initialValues }, ranges);

  // Initialize form methods
  const methods = useFormMethods<RangeSelectorControls>(config);

  // Watch for form value changes
  useEffect(() => {
    const subscription = methods.watch((value) => {
      if (value.selectedRangeId) {
        onRangeSelectChange(value.selectedRangeId);
      }
    });
    return () => subscription.unsubscribe();
  }, [methods, onRangeSelectChange]);

  // Set the value when it changes
  useEffect(() => {
    methods.setValue('selectedRangeId', initialValues?.selectedRangeId || 'Default selection', {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  }, [initialValues?.selectedRangeId, methods]);

  return <Form config={config} methods={methods} />;
};

export default RangeSelector;
