import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import FormV2 from '../form-v2';

type TestFormData = {
  username: string;
  email: string;
};

// Wrapper component to use the form
const TestFormWrapper = ({
  onSubmit,
  error,
  success,
}: {
  onSubmit: jest.Mock;
  error?: string;
  success?: string;
}) => {
  const methods = useForm<TestFormData>();

  return (
    <FormV2<TestFormData>
      methods={methods}
      onSubmit={onSubmit}
      title={{ text: 'Test Form V2', variant: 'h4' }}
      error={error}
      success={success}
      submitButtonText="Submit Form"
    >
      <input {...methods.register('username')} placeholder="Enter username" type="text" />
      <input {...methods.register('email')} placeholder="Enter email" type="email" />
    </FormV2>
  );
};

describe('FormV2', () => {
  it('should render form with title and submit button', () => {
    const mockSubmit = jest.fn();
    render(<TestFormWrapper onSubmit={mockSubmit} />);

    expect(screen.getByText('Test Form V2')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
    expect(screen.getByText('Submit Form')).toBeInTheDocument();
  });

  it('should call onSubmit when form is submitted', async () => {
    const mockSubmit = jest.fn();
    render(<TestFormWrapper onSubmit={mockSubmit} />);

    const usernameInput = screen.getByPlaceholderText('Enter username') as HTMLInputElement;
    const emailInput = screen.getByPlaceholderText('Enter email') as HTMLInputElement;
    const submitButton = screen.getByText('Submit Form');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
      });
    });
  });

  it('should display error message when error prop is provided', () => {
    const mockSubmit = jest.fn();
    render(<TestFormWrapper onSubmit={mockSubmit} error="Login failed" />);

    expect(screen.getByText('Login failed')).toBeInTheDocument();
  });

  it('should display success message when success prop is provided', () => {
    const mockSubmit = jest.fn();
    render(<TestFormWrapper onSubmit={mockSubmit} success="Registration successful" />);

    expect(screen.getByText('Registration successful')).toBeInTheDocument();
  });

  it('should render children inside form', () => {
    const mockSubmit = jest.fn();

    const ChildrenWrapper = () => {
      const methods = useForm<TestFormData>();
      return (
        <FormV2<TestFormData> methods={methods} onSubmit={mockSubmit}>
          <div data-testid="custom-child">Custom Form Field</div>
        </FormV2>
      );
    };

    render(<ChildrenWrapper />);

    expect(screen.getByTestId('custom-child')).toBeInTheDocument();
  });

  it('should handle submit without onSubmit prop', async () => {
    const NoSubmitWrapper = () => {
      const methods = useForm<TestFormData>();
      return (
        <FormV2<TestFormData> methods={methods}>
          <input {...methods.register('username')} placeholder="Enter username" type="text" />
        </FormV2>
      );
    };

    const { container } = render(<NoSubmitWrapper />);

    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();

    // Should not throw error when submitted without onSubmit
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(form).toBeInTheDocument();
    });
  });
});
