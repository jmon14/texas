// External libraries
import { fireEvent, render, screen } from '@testing-library/react';

// Components
import FormInput, { InputProps } from '../form-input';

// Constants
import { withForm } from '../../../utils/test-utils';

type Control = {
  control: string;
};

describe('form input component', () => {
  it(`should be rendered as control with label and initial value`, () => {
    const Input = withForm<Control, InputProps<Control>>(FormInput);
    // Render FormInput component
    render(<Input name="control" label="control" initialValue="Testing" />);

    // Expect label and value to be displayed
    expect(screen.getByLabelText('control')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Testing')).toBeInTheDocument();
  });

  it('should display error after blur if input is required', async () => {
    const Input = withForm<Control, InputProps<Control>>(FormInput);
    // Render FormInput component
    render(
      <Input
        name="control"
        label="control"
        validation={{
          required: 'Control is required',
        }}
      />,
    );

    fireEvent.blur(screen.getByLabelText('control'));

    expect(await screen.findByText('Control is required')).toBeInTheDocument();
  });
});
