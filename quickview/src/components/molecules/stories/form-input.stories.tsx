import { Meta, StoryObj } from '@storybook/react';
import FormInputComp, { InputProps } from '../form-input';
import { useForm } from 'react-hook-form';

const meta: Meta<typeof FormInputComp> = {
  title: 'Molecules/FormInput',
  component: FormInputComp,
  argTypes: {
    label: {
      description: 'Label for the input',
    },
    validation: {
      description: 'Validation rules for the input',
    },
  },
};

export default meta;

type Controls = {
  control: string;
};

type Story = StoryObj<typeof FormInputComp<Controls>>;

const InputWithFormHook = (args: InputProps<Controls>) => {
  const {
    formState: { errors },
    getValues,
    register,
  } = useForm<Controls>({
    mode: 'onBlur',
  });

  return (
    <FormInputComp
      {...args}
      getValues={getValues}
      register={register}
      errors={errors}
      name="control"
    />
  );
};

export const FormInput: Story = {
  render: (args) => <InputWithFormHook {...args} />,
  args: {
    label: 'Label',
    validation: {
      required: 'Input is required',
    },
  },
};
