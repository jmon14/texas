// NestJS
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

// Services
import { ConfigurationService } from '../../config/configuration.service';

// Interfaces
import { TokenPayload } from '../interfaces/token.interface';

/**
 * Strategy used to authenticate user with JWT
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(protected readonly configurationService: ConfigurationService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      secretOrKey: configurationService.get('JWT_SECRET'),
    });
  }

  /**
   * Get payload from JWT
   *
   * @param payload JWT payload
   * @returns
   */
  async validate(payload: TokenPayload): Promise<TokenPayload> {
    return payload;
  }
}
