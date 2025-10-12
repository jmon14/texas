// NestJS
import { Injectable, Logger } from '@nestjs/common';

// External libraries
import Mail = require('nodemailer/lib/mailer');
import * as nodemailer from 'nodemailer';

// Strategies
import { EmailStrategy } from './email.strategy';

@Injectable()
export class EtherealStrategy implements EmailStrategy {
  private readonly logger = new Logger(EtherealStrategy.name);

  async createTransport(): Promise<Mail> {
    const testAccount = await nodemailer.createTestAccount();

    // Log test account credentials for development
    this.logger.log('Ethereal test account created:');
    this.logger.log(`Email: ${testAccount.user}`);
    this.logger.log(`Password: ${testAccount.pass}`);
    this.logger.log(`Web interface: https://ethereal.email/login`);

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
