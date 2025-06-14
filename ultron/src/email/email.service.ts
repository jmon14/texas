// NestJS
import { Injectable } from '@nestjs/common';

// External libraries
import Mail = require('nodemailer/lib/mailer');

// Services
import { ConfigurationService } from '../config/configuration.service';
import { EmailStrategy } from './strategies/email.strategy';
import { SesStrategy } from './strategies/ses.strategy';
import { EtherealStrategy } from './strategies/ethereal.strategy';

@Injectable()
export class EmailService {
  private nodemailerTransport: Mail;
  private strategy!: EmailStrategy;

  constructor(
    private readonly configurationService: ConfigurationService,
    private readonly sesStrategy: SesStrategy,
    private readonly etherealStrategy: EtherealStrategy,
  ) {
    this.initializeStrategy();
  }

  private async initializeStrategy() {
    const environment = await this.configurationService.get('NODE_ENV');
    this.strategy = environment === 'production' ? this.sesStrategy : this.etherealStrategy;
    this.nodemailerTransport = await this.strategy.createTransport();
  }

  async sendMail(mailOptions: Mail.Options): Promise<any> {
    try {
      const info = await this.nodemailerTransport.sendMail({
        ...mailOptions,
        from: await this.configurationService.get('EMAIL_FROM'),
      });

      return info;
    } catch (error) {
      throw error;
    }
  }
}
