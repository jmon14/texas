// NestJS
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

// External libraries
import * as Mail from 'nodemailer/lib/mailer';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private nodemailerTransport: Mail;

  constructor(private readonly configService: ConfigService) {
    this.nodemailerTransport = nodemailer.createTransport({
      service: this.configService.get('EMAIL_SERVICE'),
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASSWORD'),
      },
    });
  }

  sendMail(mailOptions: Mail.Options): Promise<any> {
    return this.nodemailerTransport.sendMail(mailOptions);
  }
}
