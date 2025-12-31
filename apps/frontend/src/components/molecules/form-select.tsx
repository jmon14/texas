// External libraries
import { FieldValues, RegisterOptions } from 'react-hook-form';
import MuiSelect, { SelectProps as MuiSelectProps } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

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
        value={getValues(name) || initialValue || ''}
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
