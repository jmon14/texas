// NestJS
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';

// External libraries
import * as bcrypt from 'bcrypt';
import Mail from 'nodemailer/lib/mailer';

// Services
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { EmailService } from 'src/email/email.service';
import { ConfigurationService } from 'src/config/configuration.service';

// Entities
import { UserEntity } from 'src/database/entities/user.entity';

// Utils
import { Utils } from 'src/utils/utils';

// Mocks
import {
  mockedConfigurationService,
  mockedEmailService,
  mockedJwtService,
  mockedUsersService,
  mockMailDto,
  mockPayloadReq,
  mockResponse,
} from 'src/utils/mocks';

// DTOs
import EmailDto from 'src/users/dtos/email.dto';
import { confirmationLink, LinkMail, resetLink } from 'src/auth/auth.constants';

describe('AuthService', () => {
  let configurationService: ConfigurationService;
  let usersService: UsersService;
  let emailService: EmailService;
  let authService: AuthService;
  let jwtService: JwtService;
  let user: UserEntity;
  let mail: Mail.Options;

  beforeEach(async () => {
    user = new UserEntity();

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockedUsersService,
        },
        {
          provide: EmailService,
          useValue: mockedEmailService,
        },
        {
          provide: ConfigurationService,
          useValue: mockedConfigurationService,
        },
        {
          provide: JwtService,
          useValue: mockedJwtService,
        },
      ],
    }).compile();

    jwtService = module.get(JwtService);
    authService = module.get(AuthService);
    emailService = module.get(EmailService);
    usersService = module.get(UsersService);
    configurationService = module.get(ConfigurationService);
  });

  describe('validateUser', () => {
    it('should return user if correct credentials', async () => {
      jest.spyOn(usersService, 'getByUsername').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);
      await expect(authService.validateUser('testuser', 'testpwrd')).resolves.toEqual(user);
    });

    it('should return null user if not found or incorrect password', async () => {
      jest.spyOn(usersService, 'getByUsername').mockResolvedValue(null);
      await expect(authService.validateUser('testuser', 'testpwrd')).resolves.toBeNull();

      jest.spyOn(usersService, 'getByUsername').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => false);
      await expect(authService.validateUser('testuser', 'testpwrd')).resolves.toBeNull();
    });

    it('should throw when something goes wrong in user service or bcrypt', async () => {
      jest.spyOn(usersService, 'getByUsername').mockRejectedValue(new Error());
      await expect(authService.validateUser('testuser', 'testpwrd')).rejects.toThrow();

      jest.spyOn(usersService, 'getByUsername').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => {
        throw new Error();
      });
      await expect(authService.validateUser('testuser', 'testpwrd')).rejects.toThrow();
    });
  });

  describe('decodeToken', () => {
    it('should decode token into payload using secret', async () => {
      jest.spyOn(jwtService, 'verify').mockReturnValue(mockMailDto);

      await expect(authService.decodeToken<EmailDto>('TOKEN', 'SECRET')).resolves.toEqual(
        mockMailDto,
      );
    });
  });

  describe('setAuthCookies', () => {
    it('should create 3 auth cookies, set header and persist refresh token', async () => {
      const payload = mockPayloadReq.user;
      jest
        .spyOn(Utils, 'createCookie')
        .mockReturnValueOnce('AuthCookie')
        .mockReturnValueOnce('RefreshCookie')
        .mockReturnValueOnce('RefreshExistCookie');

      await authService.setAuthCookies(mockResponse, payload);

      expect(Utils.createCookie).toHaveBeenCalledTimes(3);
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Set-Cookie', [
        'AuthCookie',
        'RefreshCookie',
        'RefreshExistCookie',
      ]);
      expect(usersService.setCurrentRefreshToken).toHaveBeenCalled();
    });
  });

  describe('removeAuthCookies', () => {
    it('should return refresh cookies and signed token', async () => {
      const payload = mockPayloadReq.user;
      jest
        .spyOn(Utils, 'createCookie')
        .mockReturnValueOnce('AuthCookie')
        .mockReturnValueOnce('RefreshCookie')
        .mockReturnValueOnce('RefreshExistCookie');

      await authService.removeAuthCookies(mockResponse, payload);

      expect(Utils.createCookie).toHaveBeenCalledTimes(3);
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Set-Cookie', [
        'AuthCookie',
        'RefreshCookie',
        'RefreshExistCookie',
      ]);
      expect(mockedUsersService.removeRefreshToken).toHaveBeenCalledWith(payload.uuid);
    });
  });

  describe('sendEmailLink', () => {
    it('should send email with reset link', async () => {
      jest.spyOn(jwtService, 'sign').mockReturnValue('SIGNED_TOKEN');
      mail = {
        from: 'contact@allinrange.com',
        subject: resetLink.subject,
        text: `${resetLink.content} http://localhost:3001/${resetLink.url}?token=SIGNED_TOKEN`,
        to: mockMailDto.email,
      };
      await authService.sendEmailLink(mockMailDto, LinkMail.reset);
      expect(emailService.sendMail).toHaveBeenCalledWith(mail);
    });

    it('should send email with confirmation link', async () => {
      jest.spyOn(jwtService, 'sign').mockReturnValue('SIGNED_TOKEN');
      mail = {
        from: 'contact@allinrange.com',
        subject: confirmationLink.subject,
        text: `${confirmationLink.content} http://localhost:3001/${confirmationLink.url}?token=SIGNED_TOKEN`,
        to: mockMailDto.email,
      };
      await authService.sendEmailLink(mockMailDto, LinkMail.confirm);
      expect(emailService.sendMail).toHaveBeenCalledWith(mail);
    });
  });
});
