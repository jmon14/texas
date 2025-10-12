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
