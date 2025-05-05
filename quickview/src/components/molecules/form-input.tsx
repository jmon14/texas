// External libraries
import { FieldValues, RegisterOptions } from 'react-hook-form';
import { TextField, TextFieldProps } from '@mui/material';

// Utils
import { buildValidate, isCustomValidation, WithFormProps } from '../../utils/form-utils';

// Input props
export type InputProps<TFormFields extends FieldValues> = WithFormProps<TFormFields> &
  Omit<TextFieldProps, 'name'>;

const FormInput = <TControls extends FieldValues>({
  name,
  errors,
  register,
  getValues,
  validation,
  initialValue,
  ...props
}: InputProps<TControls>) => {
  const options: RegisterOptions<TControls> = {
    ...validation,
    validate:
      validation && validation.validate
        ? isCustomValidation(validation.validate)
          ? buildValidate(validation.validate, getValues)
          : validation?.validate
        : undefined,
  };

  return (
    <TextField
      helperText={!!errors[name] ? (errors[name]?.message as string) : ''}
      defaultValue={initialValue || ''}
      {...register(name, options)}
      error={!!errors[name]}
      {...props}
    />
  );
};

export default FormInput;
