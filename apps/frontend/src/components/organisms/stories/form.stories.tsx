import Paper from '@mui/material/Paper';
import { action } from '@storybook/addon-actions';
import { Meta, StoryObj } from '@storybook/react';

import FormComp, { FormProps, useFormMethods } from '../form';
import { EMAIL_REGEX } from '../../../constants';

type Controls = {
  email: string;
  password: string;
};

const FormWithHook = (args: Omit<FormProps<Controls>, 'methods'>) => {
  const methods = useFormMethods<Controls>(args.config);
  return <FormComp {...args} methods={methods} />;
};

const meta: Meta<typeof FormComp> = {
  title: 'Organisms/Form',
  component: FormComp,
  argTypes: {
    config: {
      control: 'object',
      description: 'Form configuration (title, controls, etc).',
    },
    onSubmit: {
      description: 'Submit handler called with validated form values.',
    },
    onChange: {
      description: 'Callback fired on any form value change.',
    },
  },
  decorators: [
    (Story) => (
      <Paper sx={{ padding: '20px', width: '600px' }}>
        <Story />
      </Paper>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof FormComp<Controls>>;

export const Default: Story = {
  render: (args) => <FormWithHook {...args} />,
  args: {
    config: {
      title: {
        text: 'Example form',
      },
      controls: [
        {
          controlType: 'input',
          label: 'Email input',
          type: 'email',
          name: 'email',
          validation: {
            pattern: {
              value: EMAIL_REGEX,
              message: 'Incorrect e-mail format.',
            },
          },
        },
        {
          controlType: 'input',
          type: 'password',
          name: 'password',
          label: 'Input password',
          validation: {
            required: 'Password is required',
          },
        },
        {
          controlType: 'button',
          text: 'Submit button',
        },
      ],
    },
    onSubmit: action('submit'),
    onChange: action('change'),
  },
};
