// NestJS
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

// External libraries
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

// Interfaces
import { TokenPayload } from '../interfaces/token.interface';

/**
 * Strategy used to authenticate user with JWT
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(protected readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.Authentication,
      ]),
      secretOrKey: configService.get('JWT_SECRET'),
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
