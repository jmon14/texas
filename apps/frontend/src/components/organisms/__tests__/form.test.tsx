import { render, screen } from '@testing-library/react';
import Form, { useFormMethods } from '../form';

type TestFormData = {
  email: string;
  password: string;
};

// Simple wrapper with basic inputs
const TestFormWrapper = ({ onSubmit }: { onSubmit: jest.Mock }) => {
  const methods = useFormMethods<TestFormData>();

  return (
    <Form<TestFormData>
      methods={methods}
      onSubmit={onSubmit}
      config={{
        title: { text: 'Test Form' },
        controls: [
          {
            controlType: 'button',
            text: 'Submit',
          },
        ],
      }}
    >
      <input {...methods.register('email')} placeholder="Enter email" type="email" />
      <input {...methods.register('password')} placeholder="Enter password" type="password" />
    </Form>
  );
};

describe('Form', () => {
  it('should render form element', () => {
    const mockSubmit = jest.fn();
    const { container } = render(<TestFormWrapper onSubmit={mockSubmit} />);

    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('should render children when provided', () => {
    const mockSubmit = jest.fn();

    const ChildrenWrapper = () => {
      const methods = useFormMethods<TestFormData>();
      return (
        <Form<TestFormData> methods={methods} onSubmit={mockSubmit}>
          <div>Custom Child Content</div>
        </Form>
      );
    };

    render(<ChildrenWrapper />);

    expect(screen.getByText('Custom Child Content')).toBeInTheDocument();
  });

  it('should have useFormMethods helper that works in component', () => {
    const TestMethodsWrapper = () => {
      const methods = useFormMethods<TestFormData>();

      return (
        <div>
          <div data-testid="has-register">
            {typeof methods.register === 'function' ? 'yes' : 'no'}
          </div>
          <div data-testid="has-handleSubmit">
            {typeof methods.handleSubmit === 'function' ? 'yes' : 'no'}
          </div>
          <div data-testid="has-formState">{methods.formState != null ? 'yes' : 'no'}</div>
          <div data-testid="has-getValues">
            {typeof methods.getValues === 'function' ? 'yes' : 'no'}
          </div>
        </div>
      );
    };

    render(<TestMethodsWrapper />);

    expect(screen.getByTestId('has-register')).toHaveTextContent('yes');
    expect(screen.getByTestId('has-handleSubmit')).toHaveTextContent('yes');
    expect(screen.getByTestId('has-formState')).toHaveTextContent('yes');
    expect(screen.getByTestId('has-getValues')).toHaveTextContent('yes');
  });
});
