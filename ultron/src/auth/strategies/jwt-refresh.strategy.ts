// NestJS
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

// External libraries
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

// Services
import { UsersService } from 'src/users/users.service';

// Entities
import { UserEntity } from 'src/database/entities/user.entity';

// Interfaces
import { TokenPayload } from '../interfaces/token.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    protected readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => request?.cookies?.Refresh]),
      secretOrKey: configService.get('JWT_REFRESH_SECRET'),
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
      const user = await this.userService.getByIdRefresh(refreshToken, payload.id);
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
