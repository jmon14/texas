// React
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

// Store
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../../../store/slices/user-slice';

// Components
import Account from '../account';

// MSW Server and Handlers
import { server } from '../../../msw/server';
import { authErrorHandlers } from '../../../msw/handlers/index';

// Constants
import { FetchStatus } from '../../../constants';

const mockUser = {
  username: 'testuser',
  email: 'test@example.com',
  active: true,
  uuid: 'test-uuid-123',
  files: [
    {
      url: 'https://example.com/file1.pdf',
      size: 12345,
      name: 'file1.pdf',
      user: 'testuser',
      uuid: 'file-uuid-1',
    },
  ],
};

const createTestStore = () => {
  return configureStore({
    reducer: {
      user: userReducer,
    },
    preloadedState: {
      user: {
        user: mockUser,
        status: FetchStatus.SUCCEDED,
        error: null,
        resendVerificationStatus: FetchStatus.IDDLE,
        resendVerificationError: null,
        resetPasswordStatus: FetchStatus.IDDLE,
        resetPasswordError: null,
      },
    },
  });
};

const renderWithProviders = (component: React.ReactElement) => {
  const store = createTestStore();
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>,
  );
};

describe('Account Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders user information correctly', () => {
    renderWithProviders(<Account />);

    expect(screen.getByText('Account Settings')).toBeInTheDocument();
    expect(screen.getAllByText('testuser').length).toBeGreaterThan(0);
    expect(screen.getAllByText('test@example.com').length).toBeGreaterThan(0);
    expect(screen.getByText('Active Account')).toBeInTheDocument();
  });

  it('displays reset password button', () => {
    renderWithProviders(<Account />);

    expect(screen.getByText('Reset Password')).toBeInTheDocument();
  });

  it('displays delete account button', () => {
    renderWithProviders(<Account />);

    expect(screen.getByText('Delete Account')).toBeInTheDocument();
  });

  it('handles password reset successfully', async () => {
    renderWithProviders(<Account />);

    const resetButton = screen.getByRole('button', { name: /reset password/i });
    fireEvent.click(resetButton);

    // Wait for Redux thunk to complete and success message to appear
    await waitFor(() => {
      expect(screen.getByText('Password reset email sent successfully!')).toBeInTheDocument();
    });
  });

  it('handles password reset error', async () => {
    // Use error handler from organized handlers
    server.use(authErrorHandlers.resetPasswordError);

    renderWithProviders(<Account />);

    const resetButton = screen.getByRole('button', { name: /reset password/i });
    fireEvent.click(resetButton);

    // Wait for Redux thunk to complete and error message to appear
    await waitFor(() => {
      expect(screen.getByText('Failed to send email')).toBeInTheDocument();
    });
  });

  it('opens delete account dialog when delete button is clicked', () => {
    renderWithProviders(<Account />);

    const deleteButton = screen.getByRole('button', { name: /delete account/i });
    fireEvent.click(deleteButton);

    expect(screen.getByText(/are you sure you want to delete your account/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    // Check for dialog title instead of button text
    expect(screen.getByRole('heading', { name: /delete account/i })).toBeInTheDocument();
  });

  it('closes delete account dialog when cancel is clicked', async () => {
    renderWithProviders(<Account />);

    const deleteButton = screen.getByRole('button', { name: /delete account/i });
    fireEvent.click(deleteButton);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(
        screen.queryByText(/are you sure you want to delete your account/i),
      ).not.toBeInTheDocument();
    });
  });

  it('handles delete account confirmation', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    renderWithProviders(<Account />);

    const deleteButton = screen.getByRole('button', { name: /delete account/i });
    fireEvent.click(deleteButton);

    // Get all delete account buttons and click the one in the dialog (last one)
    const confirmDeleteButtons = screen.getAllByRole('button', { name: /delete account/i });
    fireEvent.click(confirmDeleteButtons[confirmDeleteButtons.length - 1]);

    expect(consoleSpy).toHaveBeenCalledWith('Delete account functionality to be implemented');

    consoleSpy.mockRestore();
  });
});
