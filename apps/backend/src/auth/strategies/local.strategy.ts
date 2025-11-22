// NestJS
import { PassportStrategy } from '@nestjs/passport';
import { UnauthorizedException, HttpException, HttpStatus, Injectable } from '@nestjs/common';

// External libraries
import { Strategy } from 'passport-local';

// Services
import { AuthService } from '../auth.service';

// Entities
import { UserEntity } from '../../database/entities/user.entity';

/**
 * Local strategy that allows to authenticate using a username and password
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  /**
   * Validate local strategy, username and password
   * provided by passport and add user object to request
   *
   * @param username Fetch user by username
   * @param password Compare with hashed password of user found
   * @returns Inject user into request object
   */
  async validate(username: string, password: string): Promise<UserEntity> {
    try {
      const user = await this.authService.validateUser(username, password);
      if (!user) {
        throw new UnauthorizedException('Wrong credentials provided');
      }
      return user;
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
