// External libraries
import { FieldValues, RegisterOptions } from 'react-hook-form';
import TextField, { TextFieldProps } from '@mui/material/TextField';

// Utils
import { buildValidate, isCustomValidation, WithFormProps } from '../../utils/form-utils';

/**
 * Props for the FormInput component
 * @interface InputProps
 * @template TFormFields - Type-safe form field values from react-hook-form
 * @extends {WithFormProps<TFormFields>}
 * @extends {Omit<TextFieldProps, 'name'>}
 */
export type InputProps<TFormFields extends FieldValues> = WithFormProps<TFormFields> &
  Omit<TextFieldProps, 'name'>;

/**
 * FormInput component integrating Material-UI TextField with React Hook Form.
 *
 * Provides a fully-typed input field with automatic form registration, validation,
 * and error handling. Supports custom validation rules that can reference other
 * form fields. Displays error messages as helper text and marks field with error state.
 *
 * @component
 * @template TControls - Type of form fields
 * @example
 * ```tsx
 * Basic usage with validation
 * <FormInput
 *   name="email"
 *   label="Email"
 *   register={register}
 *   errors={errors}
 *   getValues={getValues}
 *   validation={{
 *     required: 'Email is required',
 *     pattern: {
 *       value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
 *       message: 'Invalid email address'
 *     }
 *   }}
 * />
 * ```
 *
 * @example
 * With custom validation and initial value
 * ```tsx
 * <FormInput
 *   name="username"
 *   label="Username"
 *   register={register}
 *   errors={errors}
 *   getValues={getValues}
 *   initialValue="john_doe"
 *   validation={{
 *     required: 'Username is required',
 *     minLength: { value: 3, message: 'Min 3 characters' },
 *     validate: {
 *       noSpaces: (value) => !/\s/.test(value) || 'No spaces allowed'
 *     }
 *   }}
 * />
 * ```
 *
 * @example
 * Multiline input with custom props
 * ```tsx
 * <FormInput
 *   name="description"
 *   label="Description"
 *   register={register}
 *   errors={errors}
 *   getValues={getValues}
 *   multiline
 *   rows={4}
 *   fullWidth
 * />
 * ```
 *
 * @param {InputProps<TControls>} props - The component props
 * @param {string} props.name - Field name in the form
 * @param {Function} props.register - React Hook Form register function
 * @param {Object} props.errors - Form errors object
 * @param {Function} props.getValues - Get form values function
 * @param {Object} [props.validation] - Validation rules
 * @param {any} [props.initialValue] - Initial field value
 * @returns {JSX.Element} Rendered form input field with validation
 */
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
