// External libraries
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Test utils
import { renderWithProviders } from '../../../utils/test-utils';

// Components
import Login from '../login';

describe('login form', () => {
  it('should display required errors when submitting with empty data', async () => {
    // Render form without data
    renderWithProviders(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // Expect required error labels
    await waitFor(() => {
      screen.getByText(/username is required/i);
      screen.getByText(/password is required/i);
    });
  });

  it('should display form error for invalid data', async () => {
    // Render form with invalid data
    renderWithProviders(
      <MemoryRouter>
        <Login initialValues={{ username: 'wronguser', password: 'wrongpwd' }} />
      </MemoryRouter>,
    );

    // Expect no error message before submitting
    expect(screen.queryByText(/login error/i)).not.toBeInTheDocument();

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // Expect error message after failed request
    await waitFor(() => screen.getByText(/login error/i));
  });

  it('should display success message for valid data', async () => {
    // Render form with valid data
    renderWithProviders(
      <MemoryRouter>
        <Login initialValues={{ username: 'user', password: 'pwd' }} />
      </MemoryRouter>,
    );

    // Expect no success message before submitting
    expect(screen.queryByText(/login succesful!/i)).not.toBeInTheDocument();

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // Expect success message after server response
    await waitFor(() => screen.getByText(/login succesful!/i));
  });
});
