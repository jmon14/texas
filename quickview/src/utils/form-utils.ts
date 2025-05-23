// React
import { HTMLInputTypeAttribute } from 'react';

// External libraries
import {
  UseFormGetValues,
  UseFormRegister,
  RegisterOptions,
  ValidationMode,
  FieldErrors,
  FieldValues,
  PathValue,
  Validate,
  Path,
} from 'react-hook-form';
import { TypographyProps } from '@mui/material';

// Constants
import { EMAIL_REGEX, FetchStatus, PWD_REGEX, USER_REGEX } from '../constants';

type Comparison = 'equal';

// Validation utils
export type CustomValidate<TControls extends FieldValues> = {
  field: Path<TControls>;
  comparison: Comparison;
  message: string;
};

export type CustomValidation<TControls extends FieldValues> = {
  validate: CustomValidate<TControls>;
};

export const isCustomValidation = <TControls extends FieldValues>(
  validate:
    | Record<string, Validate<PathValue<TControls, Path<TControls>>>>
    | Validate<PathValue<TControls, Path<TControls>>>
    | CustomValidate<TControls>,
): validate is CustomValidate<TControls> => {
  return (validate as CustomValidate<TControls>).comparison !== undefined;
};

export const buildValidate = <TControls extends FieldValues>(
  validate: CustomValidate<TControls>,
  getValues: UseFormGetValues<TControls>,
): ((value: string) => string | true) => {
  if (validate.comparison === 'equal') {
    return (value: string) => value === getValues()[validate.field] || validate.message;
  }
  return () => true;
};

// Form controls types
export type FormControl<TControls extends FieldValues> = InputFormControl<TControls> | SelectFormControl<TControls> | ButtonForm;

export type InitialValue<TControls extends FieldValues> = { [v in Path<TControls>]?: string };

export type WithFormProps<TControls extends FieldValues> = {
  validation?: RegisterOptions<TControls> | CustomValidation<TControls>;
  getValues: UseFormGetValues<TControls>;
  register: UseFormRegister<TControls>;
  errors: FieldErrors<TControls>;
  name: Path<TControls>;
  initialValue?: string;
};

type InputFormControl<TControls extends FieldValues> = {
  validation?: RegisterOptions<TControls> | CustomValidation<TControls>;
  type?: HTMLInputTypeAttribute;
  name: Path<TControls>;
  initialValue?: string;
  controlType: 'input';
  label: string;
};

type SelectFormControl<TControls extends FieldValues> = {
  validation?: RegisterOptions<TControls> | CustomValidation<TControls>;
  name: Path<TControls>;
  initialValue?: string;
  controlType: 'select';
  label: string;
  options: { value: string; label: string }[];
};

type ButtonForm = {
  controlType: 'button';
  text: string;
};

// Form configuration utils
export type FormConfig<TControls extends FieldValues> = {
  controls?: FormControl<TControls>[];
  mode?: keyof ValidationMode;
  success?: string;
  error?: unknown;
  title?: {
    text: string;
    props?: TypographyProps;
  };
};

type FormConfigOptions<TControls extends FieldValues> = {
  initialValues?: InitialValue<TControls>;
  status?: FetchStatus;
  error?: unknown;
};

type GetConfigForm<TControls extends FieldValues> = (
  options?: FormConfigOptions<TControls>,
) => FormConfig<TControls>;

// Login form utils
export type LoginControls = {
  username: string;
  password: string;
};

export const getLoginConfigForm: GetConfigForm<LoginControls> = (
  options?: FormConfigOptions<LoginControls>,
): FormConfig<LoginControls> => {
  return {
    title: {
      text: 'Sign in',
    },
    controls: [
      {
        initialValue: options?.initialValues?.username || '',
        controlType: 'input',
        label: 'Username',
        name: 'username',
        validation: {
          required: 'Username is required',
        },
      },
      {
        initialValue: options?.initialValues?.password || '',
        controlType: 'input',
        type: 'password',
        name: 'password',
        label: 'Password',
        validation: {
          required: 'Password is required',
        },
      },
      {
        controlType: 'button',
        text: 'Sign in',
      },
    ],
    success: options?.status === FetchStatus.SUCCEDED ? 'Login succesful!' : undefined,
    error: options?.error,
  };
};

// New password form utils
export type NewPasswordControls = {
  confirmPassword: string;
  password: string;
};

export const getNewPwdConfigForm: GetConfigForm<NewPasswordControls> = (
  options?: FormConfigOptions<NewPasswordControls>,
): FormConfig<NewPasswordControls> => {
  return {
    title: {
      text: 'Update password',
      props: {
        variant: 'h5',
      },
    },
    controls: [
      {
        initialValue: options?.initialValues?.password || '',
        controlType: 'input',
        type: 'password',
        name: 'password',
        label: 'Password',
        validation: {
          pattern: {
            value: PWD_REGEX,
            message:
              'Password must contain 1 uppercase letter, 1 number and 1 special character, and at least 8 characters.',
          },
          required: 'Password is required',
        },
      },
      {
        initialValue: options?.initialValues?.confirmPassword || '',
        label: 'Confirm password',
        name: 'confirmPassword',
        controlType: 'input',
        type: 'password',
        validation: {
          validate: { comparison: 'equal', field: 'password', message: 'Passwords do not match' },
          required: 'Password confirmation is required',
        },
      },
      {
        controlType: 'button',
        text: 'Submit',
      },
    ],
    success: options?.status === FetchStatus.SUCCEDED ? 'Password succesfully updated!' : undefined,
    error: options?.error,
  };
};

// Register form utils
export type RegisterControls = {
  confirmPassword: string;
  username: string;
  password: string;
  email: string;
};

export const getRegisterConfigForm: GetConfigForm<RegisterControls> = (
  options?: FormConfigOptions<RegisterControls>,
): FormConfig<RegisterControls> => {
  return {
    title: {
      text: 'Sign up',
    },
    controls: [
      {
        initialValue: options?.initialValues?.username || '',
        controlType: 'input',
        label: 'Username',
        name: 'username',
        validation: {
          required: 'Username is required',
          pattern: {
            value: USER_REGEX,
            message: 'User should be between 6 and 20 alphanumeric characters.',
          },
        },
      },
      {
        initialValue: options?.initialValues?.email || '',
        controlType: 'input',
        label: 'Email',
        name: 'email',
        validation: {
          required: 'Email is required',
          pattern: {
            value: EMAIL_REGEX,
            message: 'Incorrect e-mail format.',
          },
        },
      },
      {
        initialValue: options?.initialValues?.password || '',
        controlType: 'input',
        label: 'Password',
        type: 'password',
        name: 'password',
        validation: {
          pattern: {
            value: PWD_REGEX,
            message:
              'Password must contain 1 uppercase letter, 1 number and 1 special character, and at least 8 characters.',
          },
          required: 'Password is required',
        },
      },
      {
        initialValue: options?.initialValues?.confirmPassword || '',
        label: 'Confirm password',
        name: 'confirmPassword',
        controlType: 'input',
        type: 'password',
        validation: {
          validate: { comparison: 'equal', field: 'password', message: 'Passwords do not match' },
          required: 'Password confirmation is required',
        },
      },
      {
        controlType: 'button',
        text: 'Sign up',
      },
    ],
    success: options?.status === FetchStatus.SUCCEDED ? 'Sign up completed!' : undefined,
    error: options?.error,
  };
};

// Reset password form utils
export type ResetControls = {
  email: string;
};

export const getResetConfigForm: GetConfigForm<ResetControls> = (
  options?: FormConfigOptions<ResetControls>,
): FormConfig<ResetControls> => {
  if (options?.status !== FetchStatus.SUCCEDED) {
    return {
      title: {
        text: 'Reset your password',
        props: {
          variant: 'h5',
        },
      },
      controls: [
        {
          initialValue: options?.initialValues?.email || '',
          controlType: 'input',
          label: 'Email',
          name: 'email',
          validation: {
            required: 'Email is required',
            pattern: {
              value: EMAIL_REGEX,
              message: 'Incorrect e-mail format.',
            },
          },
        },
        {
          controlType: 'button',
          text: 'Send link',
        },
      ],
      error: options?.error,
    };
  }
  return {
    title: {
      text: 'A link for the password reset was sent to the email provided. Please verify your inbox.',
      props: {
        variant: 'h6',
      },
    },
    success: options?.status === FetchStatus.SUCCEDED ? 'Link sent succesfully.' : undefined,
  };
};

// Range form utils
export type RangeControls = {
  name: string;
};

export const getRangeConfigForm: GetConfigForm<RangeControls> = (
  options?: FormConfigOptions<RangeControls>,
): FormConfig<RangeControls> => {
  return {
    title: {
      text: 'Range Details',
      props: {
        variant: 'h6',
      },
    },
    controls: [
      {
        initialValue: options?.initialValues?.name || '',
        controlType: 'input',
        label: 'Range Name',
        name: 'name',
        validation: {
          required: 'Range name is required',
        },
      },
      {
        controlType: 'button',
        text: 'Save Range',
      },
    ],
    success: options?.status === FetchStatus.SUCCEDED ? 'Range saved successfully!' : undefined,
    error: options?.error,
  };
};
