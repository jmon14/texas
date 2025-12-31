import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useForm } from 'react-hook-form';
import FormV2 from '../form-v2';

type TestFormData = {
  username: string;
  email: string;
};

const meta: Meta<typeof FormV2> = {
  title: 'Organisms/FormV2',
  component: FormV2,
  argTypes: {
    onSubmit: {
      description: 'Form submission handler',
    },
  },
  args: {
    onSubmit: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof FormV2<TestFormData>>;

const FormWithHook = (args: any) => {
  const methods = useForm<TestFormData>();

  return (
    <FormV2<TestFormData>
      {...args}
      methods={methods}
      title={{ text: 'Example Form', variant: 'h4' }}
      submitButtonText="Submit"
    >
      <input {...methods.register('username')} placeholder="Username" type="text" />
      <input {...methods.register('email')} placeholder="Email" type="email" />
    </FormV2>
  );
};

export const Default: Story = {
  render: (args) => <FormWithHook {...args} />,
};

export const WithError: Story = {
  render: (args) => <FormWithHook {...args} error="An error occurred" />,
};

export const WithSuccess: Story = {
  render: (args) => <FormWithHook {...args} success="Form submitted successfully" />,
};
