// React
import { useState } from 'react';

// External libraries
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import { Person, Email, Security, Delete, Email as EmailIcon } from '@mui/icons-material';

// Store
import { useAppSelector, useAppDispatch } from '../../hooks/store-hooks';
import { selectAuthenticatedUser, resendVerification, reset } from '../../store/slices/user-slice';

// Constants
import { FetchStatus } from '../../constants';

/**
 * Props for the Account component
 * @interface AccountProps
 */
type AccountProps = Record<string, never>;

/**
 * Account component - User account management and settings page.
 *
 * Displays user account information and provides access to account management
 * actions including email verification, password reset, and account deletion.
 * Shows user profile with avatar, email, username, and account status. Includes
 * loading states and success/error alerts for all actions. Uses confirmation
 * dialog for destructive actions.
 *
 * @component
 * @example
 * ```tsx
 * Basic usage in route
 * <Route path="/account" element={<Account />} />
 * ```
 *
 * @example
 * In protected route with authentication
 * ```tsx
 * <ProtectedRoute>
 *   <Route path="/settings" element={<Account />} />
 * </ProtectedRoute>
 * ```
 *
 * @example
 * In layout with navigation
 * ```tsx
 * <DashboardLayout>
 *   <Account />
 * </DashboardLayout>
 * ```
 *
 * @param {AccountProps} props - The component props (currently empty)
 * @returns {JSX.Element} Rendered account settings page with user actions
 *
 * @remarks
 * Features:
 * - Displays user profile information (email, username, avatar)
 * - Shows account verification status
 * - Resend verification email (for unverified accounts)
 * - Request password reset email
 * - Delete account (with confirmation dialog)
 * - Loading states for all async operations
 * - Success/error alerts with descriptive messages
 * - Confirmation dialog prevents accidental account deletion
 *
 * Account Actions:
 * 1. **Resend Verification** - Only shown if account not verified
 * 2. **Reset Password** - Sends password reset link to user's email
 * 3. **Delete Account** - Shows confirmation dialog (TODO: Not yet implemented)
 */
const Account = ({}: AccountProps) => {
  const user = useAppSelector(selectAuthenticatedUser);
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.user);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  const handleResetPassword = () => {
    dispatch(reset(user.email));
  };

  const handleResendVerification = () => {
    dispatch(resendVerification(user.email));
  };

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion logic
    setDeleteDialogOpen(false);
  };

  const openDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Account Settings
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ width: 64, height: 64, mr: 2 }}>
              <Person fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h6" component="h2">
                {user.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
              <Typography variant="caption" color={user.active ? 'success.main' : 'error.main'}>
                {user.active ? 'Active Account' : 'Email not confirmed'}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Account Information
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Email sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="body2">
                  <strong>Email:</strong> {user.email}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Person sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="body2">
                  <strong>Username:</strong> {user.username}
                </Typography>
              </Box>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h6" gutterBottom>
                Account Actions
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {!user.active && (
                  <Box>
                    <Button
                      variant="outlined"
                      startIcon={<EmailIcon />}
                      onClick={handleResendVerification}
                      disabled={userState.resendVerificationStatus === FetchStatus.LOADING}
                      fullWidth
                    >
                      {userState.resendVerificationStatus === FetchStatus.LOADING
                        ? 'Sending Verification Email...'
                        : 'Resend Verification Email'}
                    </Button>

                    {userState.resendVerificationStatus === FetchStatus.SUCCEDED && (
                      <Alert severity="success" sx={{ mt: 1 }}>
                        Verification email sent successfully! Please check your inbox.
                      </Alert>
                    )}

                    {userState.resendVerificationStatus === FetchStatus.FAILED && (
                      <Alert severity="error" sx={{ mt: 1 }}>
                        {userState.resendVerificationError
                          ? String(userState.resendVerificationError)
                          : 'An error occurred'}
                      </Alert>
                    )}
                  </Box>
                )}

                <Box>
                  <Button
                    variant="outlined"
                    startIcon={<Security />}
                    onClick={handleResetPassword}
                    disabled={userState.resetPasswordStatus === FetchStatus.LOADING}
                    fullWidth
                  >
                    {userState.resetPasswordStatus === FetchStatus.LOADING
                      ? 'Sending Reset Email...'
                      : 'Reset Password'}
                  </Button>

                  {userState.resetPasswordStatus === FetchStatus.SUCCEDED && (
                    <Alert severity="success" sx={{ mt: 1 }}>
                      Password reset email sent successfully!
                    </Alert>
                  )}

                  {userState.resetPasswordStatus === FetchStatus.FAILED && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                      {userState.resetPasswordError
                        ? String(userState.resetPasswordError)
                        : 'An error occurred'}
                    </Alert>
                  )}
                </Box>

                <Box>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    onClick={openDeleteDialog}
                    fullWidth
                  >
                    Delete Account
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Delete Account Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Delete Account</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete your account? This action cannot be undone and will
            permanently remove all your data.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteAccount} color="error" variant="contained">
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Account;
