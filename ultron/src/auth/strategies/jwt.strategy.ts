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
      secretOrKeyProvider: async (_request: Request, _rawJwtToken: string, done: (err: any, secretOrKey?: string | Buffer) => void) => {
        try {
          const secret = await configurationService.get('JWT_SECRET');
          if (!secret) {
            return done(new Error('JWT_SECRET is not configured'));
          }
          return done(null, secret);
        } catch (error) {
          return done(error);
        }
      },
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
