import { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Account from '../account';
import userReducer from '../../../store/slices/user-slice';
import { FetchStatus } from '../../../constants';
import { UserEntity } from '../../../../backend-api/api';

const mockUser: UserEntity = {
  uuid: 'user-1',
  username: 'johndoe',
  email: 'john.doe@example.com',
  active: true,
  files: [],
};

const meta: Meta<typeof Account> = {
  title: 'Organisms/Account',
  component: Account,
  decorators: [
    (Story) => {
      const store = configureStore({
        reducer: {
          user: userReducer,
        },
        preloadedState: {
          user: {
            user: mockUser,
            error: null,
            status: FetchStatus.SUCCEDED,
            resendVerificationStatus: FetchStatus.IDDLE,
            resendVerificationError: null,
            resetPasswordStatus: FetchStatus.IDDLE,
            resetPasswordError: null,
          },
        },
      });

      return (
        <Provider store={store}>
          <Story />
        </Provider>
      );
    },
  ],
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj<typeof Account>;

export const VerifiedAccount: Story = {};

export const UnverifiedAccount: Story = {
  decorators: [
    (Story) => {
      const store = configureStore({
        reducer: {
          user: userReducer,
        },
        preloadedState: {
          user: {
            error: null,
            user: { ...mockUser, active: false },
            status: FetchStatus.SUCCEDED,
            resendVerificationStatus: FetchStatus.IDDLE,
            resendVerificationError: null,
            resetPasswordStatus: FetchStatus.IDDLE,
            resetPasswordError: null,
          },
        },
      });

      return (
        <Provider store={store}>
          <Story />
        </Provider>
      );
    },
  ],
};
