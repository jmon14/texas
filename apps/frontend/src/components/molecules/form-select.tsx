// External libraries
import { FieldValues, RegisterOptions } from 'react-hook-form';
import MuiSelect, { SelectProps as MuiSelectProps } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

// Utils
import { buildValidate, isCustomValidation, WithFormProps } from '../../utils/form-utils';

/**
 * Option for select dropdown
 * @interface SelectOption
 */
export type SelectOption = {
  /** Option value (stored in form) */
  value: string;
  /** Option label (displayed to user) */
  label: string;
};

/**
 * Props for the FormSelect component
 * @interface FormSelectProps
 * @template TFormFields - Type-safe form field values from react-hook-form
 * @extends {WithFormProps<TFormFields>}
 * @extends {Omit<MuiSelectProps<string>, 'name'>}
 */
export type FormSelectProps<TFormFields extends FieldValues> = WithFormProps<TFormFields> &
  Omit<MuiSelectProps<string>, 'name'> & {
    /** Array of select options with value and label */
    selectOptions: SelectOption[];
  };

/**
 * FormSelect component integrating Material-UI Select with React Hook Form.
 *
 * Provides a fully-typed select dropdown with automatic form registration, validation,
 * and error handling. Supports custom validation rules that can reference other form
 * fields. Displays error state on the FormControl wrapper.
 *
 * @component
 * @template TControls - Type of form fields
 * @example
 * ```tsx
 * Basic usage with validation
 * <FormSelect
 *   name="country"
 *   label="Country"
 *   register={register}
 *   errors={errors}
 *   getValues={getValues}
 *   selectOptions={[
 *     { value: 'us', label: 'United States' },
 *     { value: 'uk', label: 'United Kingdom' },
 *     { value: 'ca', label: 'Canada' }
 *   ]}
 *   validation={{
 *     required: 'Country is required'
 *   }}
 * />
 * ```
 *
 * @example
 * With initial value and custom validation
 * ```tsx
 * <FormSelect
 *   name="difficulty"
 *   label="Difficulty Level"
 *   register={register}
 *   errors={errors}
 *   getValues={getValues}
 *   initialValue="medium"
 *   selectOptions={[
 *     { value: 'easy', label: 'Easy' },
 *     { value: 'medium', label: 'Medium' },
 *     { value: 'hard', label: 'Hard' }
 *   ]}
 * />
 * ```
 *
 * @example
 * Dynamic options based on other field
 * ```tsx
 * <FormSelect
 *   name="city"
 *   label="City"
 *   register={register}
 *   errors={errors}
 *   getValues={getValues}
 *   selectOptions={getCitiesByCountry(getValues('country'))}
 *   validation={{
 *     validate: {
 *       hasCountry: () => !!getValues('country') || 'Select country first'
 *     }
 *   }}
 * />
 * ```
 *
 * @param {FormSelectProps<TControls>} props - The component props
 * @param {string} props.name - Field name in the form
 * @param {string} props.label - Input label text
 * @param {Function} props.register - React Hook Form register function
 * @param {Object} props.errors - Form errors object
 * @param {Function} props.getValues - Get form values function
 * @param {SelectOption[]} props.selectOptions - Array of options
 * @param {Object} [props.validation] - Validation rules
 * @param {any} [props.initialValue] - Initial field value
 * @returns {JSX.Element} Rendered form select dropdown with validation
 */
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
