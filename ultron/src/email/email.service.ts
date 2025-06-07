// NestJS
import { Injectable } from '@nestjs/common';

// External libraries
import * as Mail from 'nodemailer/lib/mailer';
import * as nodemailer from 'nodemailer';

// Services
import { ConfigurationService } from '../config/configuration.service';

@Injectable()
export class EmailService {
  private nodemailerTransport: Mail;

  constructor(private readonly configurationService: ConfigurationService) {
    this.initializeTransport();
  }

  private async initializeTransport() {
    this.nodemailerTransport = nodemailer.createTransport({
      service: await this.configurationService.get('EMAIL_SERVICE'),
      auth: {
        user: await this.configurationService.get('EMAIL_USER'),
        pass: await this.configurationService.get('EMAIL_PASSWORD'),
      },
    });
  }

  async sendMail(mailOptions: Mail.Options): Promise<any> {
    return this.nodemailerTransport.sendMail(mailOptions);
  }
}
