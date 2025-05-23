// External libraries
import { FieldValues, RegisterOptions } from 'react-hook-form';
import { Select as MuiSelect, SelectProps as MuiSelectProps, MenuItem, FormControl, InputLabel } from '@mui/material';

// Utils
import { buildValidate, isCustomValidation, WithFormProps } from '../../utils/form-utils';

// Select props
export type SelectOption = {
  value: string;
  label: string;
};

export type FormSelectProps<TFormFields extends FieldValues> = WithFormProps<TFormFields> &
  Omit<MuiSelectProps<string>, 'name'> & {
    selectOptions: SelectOption[];
  };

const FormSelect = <TControls extends FieldValues>({
  name,
  errors,
  register,
  getValues,
  validation,
  initialValue,
  selectOptions,
  label,
  ...props
}: FormSelectProps<TControls>) => {
  const registerOptions: RegisterOptions<TControls> = {
    ...validation,
    validate:
      validation && validation.validate
        ? isCustomValidation(validation.validate)
          ? buildValidate(validation.validate, getValues)
          : validation?.validate
        : undefined,
  };

  return (
    <FormControl fullWidth error={!!errors[name]}>
      <InputLabel>{label}</InputLabel>
      <MuiSelect
        label={label}
        defaultValue={initialValue || ''}
        {...register(name, registerOptions)}
        {...props}
      >
        {selectOptions.map((option: SelectOption) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  );
};

export default FormSelect; 