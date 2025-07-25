// React
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

// Store
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../../../store/slices/user-slice';

// Components
import Account from '../account';

// Mock API
import * as api from '../../../api/api';

// Constants
import { FetchStatus } from '../../../constants';

// Mock the API
jest.mock('../../../../api/api', () => ({
  authApi: {
    sendResetEmail: jest.fn(),
  },
}));

const mockUser = {
  username: 'testuser',
  email: 'test@example.com',
  active: true,
  uuid: 'test-uuid-123',
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
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Active Account')).toBeInTheDocument();
    expect(screen.getByText('test-uuid-123')).toBeInTheDocument();
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
    const mockSendResetEmail = api.authApi.sendResetEmail as jest.MockedFunction<
      typeof api.authApi.sendResetEmail
    >;
    mockSendResetEmail.mockResolvedValueOnce({} as any);

    renderWithProviders(<Account />);

    const resetButton = screen.getByText('Reset Password');
    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(screen.getByText('Password reset email sent successfully!')).toBeInTheDocument();
    });

    expect(mockSendResetEmail).toHaveBeenCalledWith({ email: 'test@example.com' });
  });

  it('handles password reset error', async () => {
    const mockSendResetEmail = api.authApi.sendResetEmail as jest.MockedFunction<
      typeof api.authApi.sendResetEmail
    >;
    mockSendResetEmail.mockRejectedValueOnce({
      response: { data: { message: 'Failed to send email' } },
    });

    renderWithProviders(<Account />);

    const resetButton = screen.getByText('Reset Password');
    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to send email')).toBeInTheDocument();
    });
  });

  it('opens delete account dialog when delete button is clicked', () => {
    renderWithProviders(<Account />);

    const deleteButton = screen.getByText('Delete Account');
    fireEvent.click(deleteButton);

    expect(screen.getByText('Are you sure you want to delete your account?')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Delete Account')).toBeInTheDocument();
  });

  it('closes delete account dialog when cancel is clicked', () => {
    renderWithProviders(<Account />);

    const deleteButton = screen.getByText('Delete Account');
    fireEvent.click(deleteButton);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(
      screen.queryByText('Are you sure you want to delete your account?'),
    ).not.toBeInTheDocument();
  });

  it('handles delete account confirmation', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    renderWithProviders(<Account />);

    const deleteButton = screen.getByText('Delete Account');
    fireEvent.click(deleteButton);

    const confirmDeleteButton = screen.getByText('Delete Account');
    fireEvent.click(confirmDeleteButton);

    expect(consoleSpy).toHaveBeenCalledWith('Delete account functionality to be implemented');

    consoleSpy.mockRestore();
  });
});
