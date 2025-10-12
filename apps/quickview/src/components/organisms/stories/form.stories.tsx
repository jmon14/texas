// External libraries
import { Paper } from '@mui/material';
import { ComponentMeta, Story } from '@storybook/react';

// Components
import FormComp, { FormProps } from '../form';

// Constants
import { EMAIL_REGEX } from '../../../constants';

export default {
  title: 'Organisms/Form',
  component: FormComp,
  // TODO - Investigate circular issue SB - https://github.com/storybookjs/storybook/blob/c485675b15399a431662832964813d377d058e31/docs/snippets/common/button-story-docs-code-type.js.mdx
  parameters: {
    docs: {
      source: {
        type: 'code',
      },
    },
  },
} as ComponentMeta<typeof FormComp>;

type Controls = {
  email: string;
  password: string;
};

const Template: Story<FormProps<Controls>> = (args) => (
  <Paper sx={{ padding: '20px', width: '600px' }}>
    <FormComp {...args} />
  </Paper>
);

export const Form = Template.bind({});
Form.args = {
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
};
