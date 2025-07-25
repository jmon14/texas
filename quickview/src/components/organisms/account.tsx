// React
import { useState } from 'react';

// External libraries
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Avatar,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import { Person, Email, Security, Delete } from '@mui/icons-material';

// Store
import { useAppSelector } from '../../hooks/store-hooks';
import { selectAuthenticatedUser } from '../../store/slices/user-slice';

// API
import { authApi } from '../../api/api';

// Constants
import { FetchStatus } from '../../constants';

type AccountProps = Record<string, never>;

const Account = ({}: AccountProps) => {
  const user = useAppSelector(selectAuthenticatedUser);
  const [resetEmailStatus, setResetEmailStatus] = useState<FetchStatus>(FetchStatus.IDDLE);
  const [resetEmailError, setResetEmailError] = useState<string | null>(null);
  const [resetEmailSuccess, setResetEmailSuccess] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  const handleResetPassword = async () => {
    try {
      setResetEmailStatus(FetchStatus.LOADING);
      setResetEmailError(null);
      setResetEmailSuccess(false);

      await authApi.sendResetEmail({ email: user.email });

      setResetEmailStatus(FetchStatus.SUCCEDED);
      setResetEmailSuccess(true);
    } catch (error: any) {
      setResetEmailStatus(FetchStatus.FAILED);
      setResetEmailError(error.response?.data?.message || 'Failed to send reset email');
    }
  };

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion logic
    console.log('Delete account functionality to be implemented');
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
                <Box>
                  <Button
                    variant="outlined"
                    startIcon={<Security />}
                    onClick={handleResetPassword}
                    disabled={resetEmailStatus === FetchStatus.LOADING}
                    fullWidth
                  >
                    {resetEmailStatus === FetchStatus.LOADING
                      ? 'Sending Reset Email...'
                      : 'Reset Password'}
                  </Button>

                  {resetEmailSuccess && (
                    <Alert severity="success" sx={{ mt: 1 }}>
                      Password reset email sent successfully!
                    </Alert>
                  )}

                  {resetEmailError && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                      {resetEmailError}
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
