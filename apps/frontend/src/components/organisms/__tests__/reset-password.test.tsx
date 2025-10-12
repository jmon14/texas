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

  it('should display server error message when request fails', async () => {
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

    // Expect no error message before submitting
    expect(screen.queryByText(/server error/i)).not.toBeInTheDocument();

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /send link/i }));

    // Expect server error message
    await waitFor(() => {
      screen.getByText(/server error/i);
    });
  });

  it('should display success message when submitting form with correct data', async () => {
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

    // Expect no success message before submitting
    expect(screen.queryByText(/link sent succesfully./i)).not.toBeInTheDocument();

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /send link/i }));

    // Expect success message
    await waitFor(() => {
      screen.getByText(/link sent succesfully./i);
    });
  });
});
