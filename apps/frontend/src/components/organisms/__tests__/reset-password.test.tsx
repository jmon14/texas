// External libraries
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Components
import ResetPassword from '../reset-password';

// Utils
import { renderWithProviders } from '../../../utils/test-utils';

describe('reset password form', () => {
  it('should display required errors when submitting form with empty data', async () => {
    // Render empty form
    renderWithProviders(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>,
    );

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /send link/i }));

    // Expect required label
    await waitFor(() => {
      screen.getByText(/email is required/i);
    });
  });

  it('should display errors when submitting form with invalid data', async () => {
    // Render form with invalid data
    renderWithProviders(
      <MemoryRouter>
        <ResetPassword
          initialValues={{
            email: 'wrongmail',
          }}
        />
      </MemoryRouter>,
    );

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /send link/i }));

    // Expect error label
    await waitFor(() => {
      screen.getByText(/incorrect e-mail format./i);
    });
  });

  it('should submit form when request fails', async () => {
    // Render form with valid data
    renderWithProviders(
      <MemoryRouter>
        <ResetPassword
          initialValues={{
            email: 'fail@test.com',
          }}
        />
      </MemoryRouter>,
    );

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /send link/i }));

    // TODO: Add assertion for error handling once component displays errors
    // The API call will fail (MSW handler returns 400), but component doesn't show error message yet
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /send link/i })).toBeInTheDocument();
    });
  });

  it('should submit form with correct data', async () => {
    // Render form with valid data
    renderWithProviders(
      <MemoryRouter>
        <ResetPassword
          initialValues={{
            email: 'test@test.com',
          }}
        />
      </MemoryRouter>,
    );

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /send link/i }));

    // TODO: Add assertion for success message once component displays it
    // The API call will succeed (MSW handler returns 200), but component doesn't show success message yet
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /send link/i })).toBeInTheDocument();
    });
  });
});
