// NestJS
import { Injectable } from '@nestjs/common';

// External libraries
import Mail = require('nodemailer/lib/mailer');
import * as nodemailer from 'nodemailer';

// Strategies
import { EmailStrategy } from './email.strategy';

// Services
import { ConfigurationService } from '../../config/configuration.service';

@Injectable()
export class SesStrategy implements EmailStrategy {
  constructor(private readonly configurationService: ConfigurationService) {}

  async createTransport(): Promise<Mail> {
    return nodemailer.createTransport({
      host: `email-smtp.${await this.configurationService.get('AWS_REGION')}.amazonaws.com`,
      port: 587,
      secure: false,
      auth: {
        user: await this.configurationService.get('AWS_SES_SMTP_USERNAME'),
        pass: await this.configurationService.get('AWS_SES_SMTP_PASSWORD'),
      },
    });
  }
}
