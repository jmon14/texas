// NestJS
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

// Service
import { EmailService } from 'src/email/email.service';

// External libraries
import * as nodemailer from 'nodemailer';

// Mocks
import { mockedConfigService, testEmail } from 'src/utils/mocks';
import Mail from 'nodemailer/lib/mailer';

describe('the email service', () => {
  let emailService: EmailService;
  const transporter = { sendMail: jest.fn() } as unknown as nodemailer.Transporter;

  beforeEach(async () => {
    jest.spyOn(nodemailer, 'createTransport').mockReturnValue(transporter);

    const module = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
      ],
    }).compile();

    emailService = module.get(EmailService);
  });

  describe('sendMail', () => {
    it('should call transport sendMail method with options received', () => {
      const mail: Mail.Options = {
        to: testEmail,
        subject: 'test',
      };
      emailService.sendMail(mail);
      expect(transporter.sendMail).toHaveBeenCalledWith(mail);
    });
  });
});
