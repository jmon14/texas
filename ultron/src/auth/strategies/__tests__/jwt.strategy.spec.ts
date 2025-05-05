// NestJS
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';

// Passport strategy
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';

// Mocks
import { mockedConfigService, mockTokenPayload } from 'src/utils/mocks';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
      ],
    }).compile();

    jwtStrategy = module.get(JwtStrategy);
  });

  describe('validate', () => {
    it('should return unmodified payload', () => {
      expect(jwtStrategy.validate(mockTokenPayload)).resolves.toEqual(mockTokenPayload);
    });
  });
});
