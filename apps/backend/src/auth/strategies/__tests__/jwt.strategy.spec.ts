// NestJS
import { Test } from '@nestjs/testing';

// Passport strategy
import { JwtStrategy } from '../jwt.strategy';

// Services
import { ConfigurationService } from '../../../config/configuration.service';

// Mocks
import { mockedConfigurationService, mockTokenPayload } from '../../../utils/mocks';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigurationService,
          useValue: mockedConfigurationService,
        },
      ],
    }).compile();

    jwtStrategy = module.get(JwtStrategy);
  });

  describe('validate', () => {
    it('should return unmodified payload', async () => {
      await expect(jwtStrategy.validate(mockTokenPayload)).resolves.toEqual(mockTokenPayload);
    });
  });
});
