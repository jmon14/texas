// React
import { DetailedHTMLProps, FormHTMLAttributes, useEffect } from 'react';

// External libraries
import { useForm, FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form';
import { Button, styled, Typography } from '@mui/material';

// Components
import FormInput from '../molecules/form-input';
import FormSelect from '../molecules/form-select';

// Utils
import { FormConfig } from '../../utils/form-utils';

// Styled form component
const MyForm = styled('form')`
  flex-direction: column;
  display: flex;
  gap: 20px;
`;

export type FormProps<TFormFields extends FieldValues> = {
  config?: FormConfig<TFormFields>;
  onSubmit?: SubmitHandler<TFormFields>;
  onChange?: (data: Partial<TFormFields>) => void;
  methods: UseFormReturn<TFormFields>;
} & Omit<DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>, 'onSubmit'>;

// Hook to create form methods
export const useFormMethods = <TFormFields extends FieldValues>(config?: FormConfig<TFormFields>) => {
  return useForm<TFormFields>({
    mode: config?.mode || 'onBlur',
  });
};

const Form = <TFormFields extends FieldValues>({
  config,
  onSubmit,
  onChange,
  methods,
  children,
  ...rest
}: FormProps<TFormFields>) => {
  const {
    register,
    getValues,
    handleSubmit,
    watch,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (onChange) {
      const subscription = watch((data) => {
        onChange(data);
      });
      return () => subscription.unsubscribe();
    }
  }, [watch, onChange]);

  const handleSubmitForm = (data: TFormFields) => {
    if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <MyForm onSubmit={handleSubmit(handleSubmitForm)} {...rest}>
      {config?.title && (
        <Typography color="primary" variant="h4" textAlign="center" {...config.title.props}>{config.title.text}</Typography>
      )}
      {config?.controls?.map((control, index) => {
        if (control.controlType === 'input') {
          return (
            <FormInput
              key={index}
              label={control.label}
              name={control.name}
              validation={control.validation}
              getValues={getValues}
              register={register}
              errors={errors}
              type={control.type}
              initialValue={control.initialValue}
            />
          );
        }
        if (control.controlType === 'select') {
          return (
            <FormSelect
              key={index}
              label={control.label}
              name={control.name}
              validation={control.validation}
              getValues={getValues}
              register={register}
              errors={errors}
              initialValue={control.initialValue}
              selectOptions={control.options}
            />
          );
        }
        if (control.controlType === 'button') {
          return (
            <Button
              key={index}
              type={control.onClick ? 'button' : 'submit'}
              variant="contained"
              color={control.color}
              onClick={control.onClick}
            >
              {control.text}
            </Button>
          );
        }
        return null;
      })}
      {config?.error && (
        <Typography color={(theme) => theme.palette.error.main} sx={{ mt: '-11px', mb: '-11px' }}>
          {config.error as string}
        </Typography>
      )}
      {config?.success && (
        <Typography
          color={(theme) => theme.palette.success.main}
          sx={{ mt: '-11px', mb: '-11px' }}
        >
          {config.success}
        </Typography>
      )}
      {children}
    </MyForm>
  );
};

export default Form;
