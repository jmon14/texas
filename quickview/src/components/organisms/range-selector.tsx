// React
import { useEffect } from 'react';

// External libraries
import { SubmitHandler } from 'react-hook-form';

// Store
import { selectRange } from '../../store/slices/range-slice';

// Components
import Form, { useFormMethods } from './form';

// Hooks
import { useAppSelector } from '../../hooks/store-hooks';

// Utils
import { getRangeSelectorConfigForm, InitialValue, RangeSelectorControls } from '../../utils/form-utils';

type RangeSelectorProps = {
  initialValues?: InitialValue<RangeSelectorControls>;
  onRangeSelectChange: (rangeId: string) => void;
};

const RangeSelector = ({ initialValues, onRangeSelectChange }: RangeSelectorProps) => {
  const { ranges, error } = useAppSelector(selectRange);

  // Get range selector form configuration with stable options
  const config = getRangeSelectorConfigForm({ error }, ranges);

  // Initialize form methods
  const methods = useFormMethods<RangeSelectorControls>(config);

  // Set the value when it changes
  useEffect(() => {
    if (initialValues?.selectedRangeId !== undefined) {
      methods.setValue('selectedRangeId', initialValues.selectedRangeId);
    }
  }, [initialValues?.selectedRangeId, methods]);

  const handleChange = (data: Partial<RangeSelectorControls>) => {
    if (data.selectedRangeId) {
      onRangeSelectChange(data.selectedRangeId);
    }
  };

  return <Form config={config} methods={methods} onChange={handleChange} />;
};

export default RangeSelector; 