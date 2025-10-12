// NestJS
import { HttpException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

// Service
import { AuthService } from 'src/auth/auth.service';

// Passport strategy
import { LocalStrategy } from 'src/auth/strategies/local.strategy';
import { UserEntity } from 'src/database/entities/user.entity';

// Mocks
import { mockedAuthService } from 'src/utils/mocks';

describe('LocalStrategy', () => {
  let localStrategy: LocalStrategy;
  let user: UserEntity;

  beforeEach(async () => {
    user = new UserEntity();
    const module = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: mockedAuthService,
        },
      ],
    }).compile();

    localStrategy = module.get(LocalStrategy);
  });

  describe('validate', () => {
    it('should return user fetched with username / pwd', () => {
      jest.spyOn(mockedAuthService, 'validateUser').mockResolvedValue(user);
      expect(localStrategy.validate('testname', 'testpwrd')).resolves.toEqual(user);
    });

    it('should throw UnauthorizedException if no user found', () => {
      jest.spyOn(mockedAuthService, 'validateUser').mockResolvedValue(null);

      expect(localStrategy.validate('testname', 'testpwrd')).rejects.toThrow(
        'Wrong credentials provided',
      );
    });

    it('should throw HttpException error when fetch fails', () => {
      jest.spyOn(mockedAuthService, 'validateUser').mockRejectedValue(new Error());

      expect(localStrategy.validate('testname', 'testpwrd')).rejects.toThrow(HttpException);
    });
  });
});
