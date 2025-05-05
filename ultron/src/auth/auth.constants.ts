// Interfaces
import { SignedMail } from 'src/auth/interfaces/signed-mail.interface';

export enum LinkMail {
  reset = 'resetLink',
  confirm = 'confirmationLink',
}

export const resetLink: SignedMail = {
  url: '/auth/new-password',
  content: 'A password reset was requested. If this was you, click this link to proceed:',
  subject: 'Password reset',
};

export const confirmationLink: SignedMail = {
  url: '/auth/validate',
  content: 'Welcome to the QuickView app. To confirm your email address, click here:',
  subject: 'Email confirmation',
};
