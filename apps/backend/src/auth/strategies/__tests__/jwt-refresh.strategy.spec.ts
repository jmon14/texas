// NestJS
import { HttpException, UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

// Passport strategy
import { JwtRefreshStrategy } from 'src/auth/strategies/jwt-refresh.strategy';

// Entity
import { UserEntity } from 'src/database/entities/user.entity';

// Services
import { UsersService } from 'src/users/users.service';
import { ConfigurationService } from 'src/config/configuration.service';

// Mocks
import {
  mockedConfigurationService,
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
          provide: ConfigurationService,
          useValue: mockedConfigurationService,
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
    it('should return user fetch from user service', async () => {
      jest.spyOn(userService, 'getByIdRefresh').mockResolvedValue(user);
      await expect(jwtRefreshStrategy.validate(mockRequest, mockTokenPayload)).resolves.toEqual(
        user,
      );
    });

    it('should throw UnauthorizedException if no user is fetched', async () => {
      jest.spyOn(userService, 'getByIdRefresh').mockResolvedValue(null);
      await expect(jwtRefreshStrategy.validate(mockRequest, mockTokenPayload)).rejects.toThrow(
        'Invalid refresh token',
      );
      await expect(jwtRefreshStrategy.validate(mockRequest, mockTokenPayload)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw HttpExceptionError if service throws', async () => {
      jest.spyOn(userService, 'getByIdRefresh').mockRejectedValue(new Error());
      await expect(jwtRefreshStrategy.validate(mockRequest, mockTokenPayload)).rejects.toThrow(
        HttpException,
      );
    });
  });
});
