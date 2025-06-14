import { Injectable } from '@nestjs/common';
import Mail = require('nodemailer/lib/mailer');
import * as nodemailer from 'nodemailer';
import { EmailStrategy } from './email.strategy';

@Injectable()
export class EtherealStrategy implements EmailStrategy {
  async createTransport(): Promise<Mail> {
    const testAccount = await nodemailer.createTestAccount();

    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  getPreviewUrl(info: any): string {
    const url = nodemailer.getTestMessageUrl(info);
    return url || '';
  }
}
