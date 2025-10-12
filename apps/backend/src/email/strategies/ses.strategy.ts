// NestJS
import { Injectable, Logger } from '@nestjs/common';

// External libraries
import Mail = require('nodemailer/lib/mailer');
import * as nodemailer from 'nodemailer';

// Strategies
import { EmailStrategy } from './email.strategy';

// Services
import { ConfigurationService } from '../../config/configuration.service';

@Injectable()
export class SesStrategy implements EmailStrategy {
  private readonly logger = new Logger(SesStrategy.name);

  constructor(private readonly configurationService: ConfigurationService) {}

  async createTransport(): Promise<Mail> {
    try {
      const region = await this.configurationService.get('AWS_REGION');
      const username = await this.configurationService.get('AWS_SES_SMTP_USERNAME');
      const password = await this.configurationService.get('AWS_SES_SMTP_PASSWORD');

      if (!username || !password) {
        const error = new Error('AWS SES SMTP credentials are not configured');
        this.logger.error(error.message);
        throw error;
      }

      const transport = nodemailer.createTransport({
        host: `email-smtp.${region}.amazonaws.com`,
        port: 587,
        secure: false,
        auth: {
          user: username,
          pass: password,
        },
      });

      // Verify the connection
      await transport.verify();
      return transport;
    } catch (error) {
      this.logger.error('Failed to create SES transport:', error);
      throw error;
    }
  }
}
