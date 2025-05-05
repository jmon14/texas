// External libraries
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Utils
import { renderWithProviders } from '../../../utils/test-utils';

// Components
import NewPassword from '../new-password';

describe('new password form', () => {
  it('should display required errors when submitting form with empty data', async () => {
    // Render form without data
    renderWithProviders(
      <MemoryRouter>
        <NewPassword />
      </MemoryRouter>,
    );

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Expect required error labels
    await waitFor(() => {
      screen.getByText(/password is required/i);
      screen.getByText(/password confirmation is required/i);
    });
  });

  it('should display errors when submitting form with invalid data', async () => {
    // Render form with invalid
    renderWithProviders(
      <MemoryRouter>
        <NewPassword initialValues={{ password: 'wrongpwd', confirmPassword: 'wrongpwd2' }} />
      </MemoryRouter>,
    );

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Expect error labels for invalid data
    await waitFor(() => {
      screen.getByText(
        /password must contain 1 uppercase letter, 1 number and 1 special character, and at least 8 characters./i,
      );
      screen.getByText(/passwords do not match/i);
    });
  });

  it('should display success message when submitting valid data', async () => {
    // Render form with valid data
    renderWithProviders(
      <MemoryRouter initialEntries={['?token=token']}>
        <NewPassword initialValues={{ password: 'Password#7', confirmPassword: 'Password#7' }} />
      </MemoryRouter>,
    );

    // Expect no success message before submitting form
    expect(screen.queryByText(/password succesfully updated!/i)).not.toBeInTheDocument();

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Expect success message after server response
    await waitFor(() => {
      screen.getByText(/password succesfully updated!/i);
    });
  });

  it('should display token error when submitting without token', async () => {
    // Render form without token
    renderWithProviders(
      <MemoryRouter>
        <NewPassword initialValues={{ password: 'Password#7', confirmPassword: 'Password#7' }} />
      </MemoryRouter>,
    );

    // Expect no token error message before submitting form
    expect(screen.queryByText(/no token provided/i)).not.toBeInTheDocument();

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Expect token error message
    await waitFor(() => {
      screen.getByText(/no token provided/i);
    });
  });

  it('should display server error when request fails', async () => {
    // Render form with valid data
    renderWithProviders(
      <MemoryRouter initialEntries={['?token=token']}>
        <NewPassword
          initialValues={{ password: 'ServerError#7', confirmPassword: 'ServerError#7' }}
        />
      </MemoryRouter>,
    );

    // Expect no server error message before submitting form
    expect(screen.queryByText(/server error/i)).not.toBeInTheDocument();

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Expect token error message
    await waitFor(() => {
      screen.getByText(/server error/i);
    });
  });
});
