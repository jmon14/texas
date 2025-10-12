import Mail = require('nodemailer/lib/mailer');

export interface EmailStrategy {
  createTransport(): Promise<Mail>;
  getPreviewUrl?(info: any): string;
}
