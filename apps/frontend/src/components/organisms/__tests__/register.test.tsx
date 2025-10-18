// External libraries
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Components
import Register from '../register';

// Utils
import { renderWithProviders } from '../../../utils/test-utils';

// MSW
import { server } from '../../../msw/server';
import { userErrorHandlers } from '../../../msw/handlers/index';

describe('register form', () => {
  it('should display required errors if submitting form with empty data', async () => {
    // Render without values
    renderWithProviders(
      <MemoryRouter>
        <Register />
      </MemoryRouter>,
    );

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    // Expect required error text
    await waitFor(() => {
      screen.getByText(/username is required/i);
      screen.getByText(/email is required/i);
      screen.getByText(/password is required/i);
      screen.getByText(/password confirmation is required/i);
    });
  });

  it('should display errors when submitting form with invalid data', async () => {
    // Render with invalid data
    renderWithProviders(
      <MemoryRouter>
        <Register
          initialValues={{
            username: 'wrong',
            email: 'wrongmail',
            password: 'wrongpwd',
            confirmPassword: 'wrongpwd2',
          }}
        />
      </MemoryRouter>,
    );

    // Act
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    // Assert
    await waitFor(() => {
      screen.getByText(/user should be between 6 and 20 alphanumeric characters./i);
      screen.getByText(/incorrect e-mail format./i);
      screen.getByText(
        /password must contain 1 uppercase letter, 1 number and 1 special character, and at least 8 characters./i,
      );
      screen.getByText(/passwords do not match/i);
    });
  });

  it('should display success message when submitting form with valid data', async () => {
    // Render form with valid date
    renderWithProviders(
      <MemoryRouter>
        <Register
          initialValues={{
            username: 'username',
            email: 'test@test.com',
            password: 'Password#7',
            confirmPassword: 'Password#7',
          }}
        />
      </MemoryRouter>,
    );

    // No success message before submitting form
    expect(screen.queryByText(/sign up completed!/i)).not.toBeInTheDocument();

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    // Expect success message server response
    await waitFor(() => {
      screen.getByText(/sign up completed!/i);
    });
  });

  it('should display error message when request fails', async () => {
    // Use error handler for registration failure
    server.use(userErrorHandlers.signupDuplicateUsername);

    // Render form with valid data (will fail due to error handler)
    renderWithProviders(
      <MemoryRouter>
        <Register
          initialValues={{
            username: 'testuser',
            email: 'test@test.com',
            password: 'Password#7',
            confirmPassword: 'Password#7',
          }}
        />
      </MemoryRouter>,
    );

    // No error message before submitting form
    expect(screen.queryByText(/sign up error/i)).not.toBeInTheDocument();

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    // Error message after request fails
    await waitFor(() => {
      screen.getByText(/sign up error/i);
    });
  });
});
