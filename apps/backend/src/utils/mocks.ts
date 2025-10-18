// NestJS
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

// External libraries
import { Request, Response } from 'express';

// DTOs
import EmailDto from 'src/users/dtos/email.dto';
import { UserDto } from 'src/users/dtos/user.dto';
import TokenDto from 'src/users/dtos/confirm-email.dto';
import { ResetPwdDto } from 'src/users/dtos/reset-password.dto';

// Services
import { AuthService } from 'src/auth/auth.service';
import { EmailService } from 'src/email/email.service';
import { UsersService } from 'src/users/users.service';
import { ConfigurationService } from 'src/config/configuration.service';

// Interfaces
import { TokenPayload } from 'src/auth/interfaces/token.interface';
import { PayloadRequest, UserRequest } from 'src/auth/interfaces/request.interface';

// Entity
import { UserEntity } from 'src/database/entities/user.entity';

// Constants
export const testEmail = 'test@test.com';

/**
 * Services
 */
export const mockedConfigService: Partial<ConfigService> = {
  get: (key: string) => {
    switch (key) {
      case 'JWT_SECRET':
      case 'JWT_REFRESH_SECRET':
        return 'SECRET';
    }
  },
};

/**
 * Default implementation for ConfigurationService mock
 * Used by resetConfigurationServiceMock to restore default behavior
 */
const defaultConfigurationServiceImpl = (key: string) => {
  switch (key) {
    case 'JWT_SECRET':
    case 'JWT_REFRESH_SECRET':
    case 'JWT_EMAIL_SECRET':
      return Promise.resolve('SECRET');
    case 'JWT_EXPIRATION_TIME':
      return Promise.resolve('3600');
    case 'JWT_REFRESH_EXPIRATION_TIME':
      return Promise.resolve('18000');
    case 'JWT_EMAIL_EXPIRATION_TIME':
      return Promise.resolve('3600');
    case 'DOMAIN':
      return Promise.resolve('localhost');
    case 'UI_URL':
      return Promise.resolve('http://localhost:3001/');
    case 'EMAIL_FROM':
      return Promise.resolve('contact@allinrange.com');
    case 'NODE_ENV':
      return Promise.resolve('test');
    default:
      return Promise.resolve(undefined);
  }
};

export const mockedConfigurationService: Partial<ConfigurationService> = {
  get: jest.fn(defaultConfigurationServiceImpl),
};

/**
 * Reset ConfigurationService mock to default implementation
 * Call this in beforeEach if you need to override the mock in specific tests
 *
 * @param customImpl - Optional custom implementation to use instead of default
 */
export function resetConfigurationServiceMock(customImpl?: typeof defaultConfigurationServiceImpl) {
  (mockedConfigurationService.get as jest.Mock).mockImplementation(
    customImpl || defaultConfigurationServiceImpl,
  );
}

export const mockedJwtService: Partial<JwtService> = {
  sign: jest.fn(),
  verify: jest.fn(),
};

export const mockedAuthService: Partial<AuthService> = {
  decodeToken: jest.fn(),
  validateUser: jest.fn(),
  sendEmailLink: jest.fn(),
  setAuthCookies: jest.fn(),
  removeAuthCookies: jest.fn(),
};

export const mockedUsersService: Partial<UsersService> = {
  updatePwd: jest.fn(),
  createUser: jest.fn(),
  confirmEmail: jest.fn(),
  getByUsername: jest.fn(),
  getByIdRefresh: jest.fn(),
  removeRefreshToken: jest.fn(),
  setCurrentRefreshToken: jest.fn(),
};

export const mockedEmailService: Partial<EmailService> = {
  sendMail: jest.fn(),
};

/**
 * Mock objects
 */
export const mockTokenPayload: TokenPayload = {
  uuid: 'uuid',
};

export const mockResponse = {
  setHeader: jest.fn(),
} as unknown as Response;

export const mockRequest = {
  res: {
    setHeader: jest.fn(),
  },
} as unknown as Request;

export const mockUserReq = {
  ...mockRequest,
  user: new UserEntity(),
} as UserRequest;

export const mockPayloadReq = {
  ...mockRequest,
  user: { ...mockTokenPayload },
} as PayloadRequest;

/**
 * DTOs
 */
export const mockUserDto: UserDto = {
  email: testEmail,
  username: 'testuser',
  password: 'testpwrd',
  uuid: 'uuid',
};

export const mockResetPwdData: ResetPwdDto = {
  password: 'testpwrd',
  token: 'token',
};

export const mockTokenData: TokenDto = {
  token: 'token',
};

export const mockMailDto: EmailDto = {
  email: testEmail,
};
