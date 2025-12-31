// React
import { DetailedHTMLProps, FormHTMLAttributes } from 'react';

// External libraries
import { FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

// Styled form component
const MyForm = styled('form')`
  flex-direction: column;
  display: flex;
  gap: 20px;
`;

export type FormV2Props<TFormFields extends FieldValues> = {
  onSubmit?: SubmitHandler<TFormFields>;
  methods: UseFormReturn<TFormFields>;
  title?: {
    text: string;
    variant?: 'h4' | 'h5' | 'h6';
  };
  error?: string;
  success?: string;
  submitButtonText?: string;
} & Omit<DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>, 'onSubmit'>;

// ! Warning: This component is not yet fully implemented.
const FormV2 = <TFormFields extends FieldValues>({
  onSubmit,
  methods,
  title,
  error,
  success,
  submitButtonText,
  children,
  ...rest
}: FormV2Props<TFormFields>) => {
  const { handleSubmit } = methods;

  const handleSubmitForm = (data: TFormFields) => {
    if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <MyForm onSubmit={handleSubmit(handleSubmitForm)} {...rest}>
      {title && (
        <Typography color="primary" variant={title.variant || 'h4'} textAlign="center">
          {title.text}
        </Typography>
      )}

      {children}

      {submitButtonText && (
        <Button type="submit" variant="contained">
          {submitButtonText}
        </Button>
      )}

      {error && (
        <Typography color={(theme) => theme.palette.error.main} sx={{ mt: '-11px', mb: '-11px' }}>
          {error}
        </Typography>
      )}

      {success && (
        <Typography color={(theme) => theme.palette.success.main} sx={{ mt: '-11px', mb: '-11px' }}>
          {success}
        </Typography>
      )}
    </MyForm>
  );
};

export default FormV2;
