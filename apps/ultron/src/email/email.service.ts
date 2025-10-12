// NestJS
import { Injectable, Logger } from '@nestjs/common';

// External libraries
import Mail = require('nodemailer/lib/mailer');

// Services
import { ConfigurationService } from '../config/configuration.service';

// Strategies
import { EmailStrategy } from './strategies/email.strategy';
import { SesStrategy } from './strategies/ses.strategy';
import { EtherealStrategy } from './strategies/ethereal.strategy';

@Injectable()
export class EmailService {
  private nodemailerTransport: Mail;
  private strategy!: EmailStrategy;
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly configurationService: ConfigurationService,
    private readonly sesStrategy: SesStrategy,
    private readonly etherealStrategy: EtherealStrategy,
  ) {
    this.initializeStrategy();
  }

  private async initializeStrategy() {
    try {
      const environment = await this.configurationService.get('NODE_ENV');
      this.strategy = environment === 'production' ? this.sesStrategy : this.etherealStrategy;
      this.nodemailerTransport = await this.strategy.createTransport();
    } catch (error) {
      this.logger.error('Failed to initialize email strategy:', error);
      throw error;
    }
  }

  async sendMail(mailOptions: Mail.Options): Promise<any> {
    try {
      return await this.nodemailerTransport.sendMail(mailOptions);
    } catch (error) {
      this.logger.error('Failed to send email:', error);
      throw error;
    }
  }
}
