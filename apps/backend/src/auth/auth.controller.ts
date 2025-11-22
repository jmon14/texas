// NestJS
import { Controller, UseGuards, HttpCode, Request, Post, Get, Body } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

// Services
import { AuthService } from './auth.service';

// Guards
import JwtAuthGuard from './guards/jwt-auth.guard';
import LocalAuthGuard from './guards/local-auth.guard';
import JwtRefreshGuard from './guards/jwt-refresh-auth.guard';

// Entities
import { UserEntity } from '../database/entities/user.entity';

// Interfaces
import { UserRequest, PayloadRequest } from './interfaces/request.interface';

// DTOs
import { LoginDto } from '../users/dtos/user.dto';
import EmailDto from '../users/dtos/email.dto';

// Constants
import { LinkMail } from './auth.constants';

/**
 * Controller to handle authentication
 */
@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({
    description: 'Use username and password for authentication and return user',
    type: LoginDto,
  })
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  async login(@Request() req: UserRequest): Promise<UserEntity> {
    // User fetched
    const { user, res } = req;
    await this.authService.setAuthCookies(res, { uuid: user.uuid });
    return user;
  }

  /**
   * Refresh access token using refresh token, and update user with it
   *
   * @param req Request with user data
   * @returns User that matches token
   */
  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(@Request() req: UserRequest): Promise<UserEntity> {
    const { user, res } = req;
    await this.authService.setAuthCookies(res, { uuid: user.uuid });
    return user;
  }

  /**
   * Logout user and set empty cookies
   *
   * @param req Request with user
   */
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('logout')
  async logout(@Request() req: PayloadRequest) {
    const { user: payload, res } = req;
    await this.authService.removeAuthCookies(res, payload);
  }

  @Post('reset')
  @HttpCode(200)
  @ApiBody({
    type: EmailDto,
    description: 'Send email with reset password link',
  })
  sendResetEmail(@Body() resetData: EmailDto) {
    this.authService.sendEmailLink(resetData, LinkMail.reset);
  }

  @Post('resend-verification')
  @HttpCode(200)
  @ApiBody({
    type: EmailDto,
    description: 'Resend email verification link',
  })
  resendVerificationEmail(@Body() emailData: EmailDto) {
    this.authService.sendEmailLink(emailData, LinkMail.confirm);
  }
}
