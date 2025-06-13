// NestJS
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

// Services
import { ConfigurationService } from '../../config/configuration.service';
import { UsersService } from 'src/users/users.service';

// Entities
import { UserEntity } from 'src/database/entities/user.entity';

// Interfaces
import { TokenPayload } from '../interfaces/token.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    protected readonly configurationService: ConfigurationService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => request?.cookies?.Refresh]),
      secretOrKeyProvider: async (_request: Request, _rawJwtToken: string, done: (err: any, secretOrKey?: string | Buffer) => void) => {
        try {
          const secret = await configurationService.get('JWT_REFRESH_SECRET');
          if (!secret) {
            return done(new Error('JWT_REFRESH_SECRET is not configured'));
          }
          return done(null, secret);
        } catch (error) {
          return done(error);
        }
      },
      passReqToCallback: true,
    });
  }

  /**
   * Validate user with refresh token
   *
   * @param request - Request object
   * @param payload - Token payload
   * @returns - Validated user
   */
  async validate(request: Request, payload: TokenPayload): Promise<UserEntity> {
    const refreshToken = request.cookies?.Refresh;
    try {
      const user = await this.userService.getByIdRefresh(refreshToken, payload.uuid);
      if (user) {
        return user;
      }
      throw new UnauthorizedException('Invalid refresh token');
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      throw new HttpException(
        err.message ?? 'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
