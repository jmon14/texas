// External libraries
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { act, screen, waitFor } from '@testing-library/react';

// Test utils
import { renderWithProviders } from '../../utils/test-utils';

// Routes
import { AuthProtected } from '../auth-protected';

describe('auth protected route', () => {
  it('should render loading when cookie exist, should be logged on happy path and redirect to outlet', async () => {
    act(() => {
      renderWithProviders(
        <MemoryRouter>
          <Routes>
            <Route
              element={
                <AuthProtected
                  shouldBeLogged={true}
                  refreshCookie="cookie"
                  redirectPath="auth/login"
                />
              }
            >
              <Route path="" element={<div>Protected route</div>} />
            </Route>
          </Routes>
        </MemoryRouter>,
      );
    });

    // Loading user with refresh cookie
    expect(screen.getByText(/Loading.../)).toBeInTheDocument();
    expect(screen.queryByText(/Protected route/)).not.toBeInTheDocument();

    // Wait for user to be fetched and access protected route
    await waitFor(() => {
      expect(screen.queryByText(/Loading.../)).not.toBeInTheDocument();
      expect(screen.getByText(/Protected route/)).toBeInTheDocument();
    });
  });

  it('should navigate to login if shouldBeLogged is true and there is no refresh cookie', () => {
    // Arrange
    renderWithProviders(
      <MemoryRouter>
        <Routes>
          <Route path="auth/login" element={<div>Login route</div>} />
          <Route element={<AuthProtected shouldBeLogged={true} redirectPath="auth/login" />}>
            <Route path="" element={<div>Login protected route</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    // Assert
    expect(screen.getByText(/Login route/)).toBeInTheDocument();
    expect(screen.queryByText(/Loading.../)).not.toBeInTheDocument();
    expect(screen.queryByText(/Protected route/)).not.toBeInTheDocument();
  });
});
