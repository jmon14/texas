// NestJS
import { HttpException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

// Service
import { AuthService } from '../../auth.service';

// Passport strategy
import { LocalStrategy } from '../local.strategy';
import { UserEntity } from '../../../database/entities/user.entity';

// Mocks
import { mockedAuthService } from '../../../utils/mocks';

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
    it('should return user fetched with username / pwd', async () => {
      jest.spyOn(mockedAuthService, 'validateUser').mockResolvedValue(user);
      await expect(localStrategy.validate('testname', 'testpwrd')).resolves.toEqual(user);
    });

    it('should throw UnauthorizedException if no user found', async () => {
      jest.spyOn(mockedAuthService, 'validateUser').mockResolvedValue(null);

      await expect(localStrategy.validate('testname', 'testpwrd')).rejects.toThrow(
        'Wrong credentials provided',
      );
    });

    it('should throw HttpException error when fetch fails', async () => {
      jest.spyOn(mockedAuthService, 'validateUser').mockRejectedValue(new Error());

      await expect(localStrategy.validate('testname', 'testpwrd')).rejects.toThrow(HttpException);
    });
  });
});
