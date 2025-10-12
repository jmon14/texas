import { Meta, StoryObj } from '@storybook/react';
import FormSelectComp, { FormSelectProps, SelectOption } from '../form-select';
import { useForm } from 'react-hook-form';

const meta: Meta<typeof FormSelectComp> = {
  title: 'Molecules/FormSelect',
  component: FormSelectComp,
  argTypes: {
    label: {
      description: 'Label for the select input',
    },
    validation: {
      description: 'Validation rules for the select input',
    },
    selectOptions: {
      description: 'Options to display in the select dropdown',
    },
  },
};

export default meta;

type Controls = {
  control: string;
};

type Story = StoryObj<typeof FormSelectComp<Controls>>;

const SelectWithFormHook = (args: FormSelectProps<Controls>) => {
  const {
    formState: { errors },
    getValues,
    register,
  } = useForm<Controls>({
    mode: 'onBlur',
  });

  return (
    <FormSelectComp
      {...args}
      getValues={getValues}
      register={register}
      errors={errors}
      name="control"
    />
  );
};

const mockOptions: SelectOption[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

export const FormSelect: Story = {
  render: (args) => <SelectWithFormHook {...args} />,
  args: {
    label: 'Select an option',
    validation: {
      required: 'Selection is required',
    },
    selectOptions: mockOptions,
  },
};
