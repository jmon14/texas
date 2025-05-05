// NestJS
import { HttpException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';

// Passport strategy
import { JwtRefreshStrategy } from 'src/auth/strategies/jwt-refresh.strategy';

// Entity
import { UserEntity } from 'src/database/entities/user.entity';

// Services
import { UsersService } from 'src/users/users.service';

// Mocks
import {
  mockedConfigService,
  mockedUsersService,
  mockTokenPayload,
  mockRequest,
} from 'src/utils/mocks';

describe('JwtRefreshStrategy', () => {
  let jwtRefreshStrategy: JwtRefreshStrategy;
  let userService: UsersService;
  let user: UserEntity;

  beforeEach(async () => {
    user = new UserEntity();
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
        {
          provide: UsersService,
          useValue: mockedUsersService,
        },
        JwtRefreshStrategy,
      ],
    }).compile();

    jwtRefreshStrategy = module.get(JwtRefreshStrategy);
    userService = module.get(UsersService);
  });

  describe('validate', () => {
    it('should return user fetch from user service', () => {
      jest.spyOn(userService, 'getByIdRefresh').mockResolvedValue(user);
      expect(jwtRefreshStrategy.validate(mockRequest, mockTokenPayload)).resolves.toEqual(user);
    });

    it('should throw UnauthorizedException if no user is fetched', () => {
      jest.spyOn(userService, 'getByIdRefresh').mockResolvedValue(null);
      expect(jwtRefreshStrategy.validate(mockRequest, mockTokenPayload)).rejects.toThrow(
        'Invalid refresh token',
      );
      expect(jwtRefreshStrategy.validate(mockRequest, mockTokenPayload)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw HttpExceptionError if service throws', () => {
      jest.spyOn(userService, 'getByIdRefresh').mockRejectedValue(new Error());
      expect(jwtRefreshStrategy.validate(mockRequest, mockTokenPayload)).rejects.toThrow(
        HttpException,
      );
    });
  });
});
