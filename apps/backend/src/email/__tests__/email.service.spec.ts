// NestJS
import { Test } from '@nestjs/testing';

// Service
import { EmailService } from 'src/email/email.service';
import { ConfigurationService } from 'src/config/configuration.service';
import { SesStrategy } from 'src/email/strategies/ses.strategy';
import { EtherealStrategy } from 'src/email/strategies/ethereal.strategy';

// External libraries
import * as nodemailer from 'nodemailer';

// Mocks
import { mockedConfigurationService, testEmail } from 'src/utils/mocks';
import Mail from 'nodemailer/lib/mailer';

describe('the email service', () => {
  let emailService: EmailService;
  let transporter: nodemailer.Transporter;
  let mockSesStrategy: any;
  let mockEtherealStrategy: any;

  beforeEach(async () => {
    // Create fresh mocks for each test
    transporter = {
      sendMail: jest.fn().mockResolvedValue({ messageId: 'test-id' }),
    } as unknown as nodemailer.Transporter;

    mockSesStrategy = {
      createTransport: jest.fn().mockResolvedValue(transporter),
    };

    mockEtherealStrategy = {
      createTransport: jest.fn().mockResolvedValue(transporter),
    };

    jest.spyOn(nodemailer, 'createTransport').mockReturnValue(transporter);

    // Override NODE_ENV for email service tests
    (mockedConfigurationService.get as jest.Mock).mockImplementation((key: string) => {
      if (key === 'NODE_ENV') {
        return Promise.resolve('development');
      }
      // Fall back to default for other keys
      return Promise.resolve(undefined);
    });

    const module = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: ConfigurationService,
          useValue: mockedConfigurationService,
        },
        {
          provide: SesStrategy,
          useValue: mockSesStrategy,
        },
        {
          provide: EtherealStrategy,
          useValue: mockEtherealStrategy,
        },
      ],
    }).compile();

    emailService = module.get(EmailService);
    // Wait for async initialization to complete
    await new Promise((resolve) => setTimeout(resolve, 100));
  });

  describe('sendMail', () => {
    it('should call transport sendMail method with options received', async () => {
      const mail: Mail.Options = {
        to: testEmail,
        subject: 'test',
      };
      const result = await emailService.sendMail(mail);
      expect(transporter.sendMail).toHaveBeenCalledWith(mail);
      expect(result).toEqual({ messageId: 'test-id' });
    });
  });
});
