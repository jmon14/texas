// React
import { DetailedHTMLProps, FormHTMLAttributes } from 'react';

// External libraries
import { useForm, FieldValues, SubmitHandler } from 'react-hook-form';
import { Button, styled, Typography } from '@mui/material';

// Components
import FormInput from '../molecules/form-input';

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
  onSubmit: SubmitHandler<TFormFields>;
} & Omit<DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>, 'onSubmit'>;

const Form = <TFormFields extends FieldValues>({
  config,
  onSubmit,
  children,
  ...rest
}: FormProps<TFormFields>) => {
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<TFormFields>({
    mode: config?.mode || 'onBlur',
  });

  return (
    <MyForm onSubmit={handleSubmit(onSubmit)} {...rest}>
      <>
        {config?.title && (
          <Typography color="primary" variant="h4" textAlign={'center'} {...config.title.props}>
            {config.title.text}
          </Typography>
        )}
        {config?.controls?.map((control, index) => {
          if (control.controlType === 'input') {
            return (
              <FormInput
                initialValue={control.initialValue}
                validation={control.validation}
                label={control.label}
                getValues={getValues}
                type={control.type}
                register={register}
                name={control.name}
                errors={errors}
                key={index}
              />
            );
          } else if (control.controlType === 'button') {
            return (
              <Button variant="contained" type="submit" key={index}>
                {control.text}
              </Button>
            );
          }
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
      </>
    </MyForm>
  );
};

export default Form;
