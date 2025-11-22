// Interfaces
import { SignedMail } from './interfaces/signed-mail.interface';

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
  content: 'Welcome to the Texas Poker app. To confirm your email address, click here:',
  subject: 'Email confirmation',
};
