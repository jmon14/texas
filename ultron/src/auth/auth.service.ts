// NestJS
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// External libraries
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import Mail from 'nodemailer/lib/mailer';

// Services
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { ConfigurationService } from '../config/configuration.service';

// Entities
import { UserEntity } from '../database/entities/user.entity';

// Interfaces
import { TokenPayload } from './interfaces/token.interface';

// Utils
import { Utils } from '../utils/utils';

// DTOs
import EmailDto from 'src/users/dtos/email.dto';

// Constants
import { confirmationLink, LinkMail, resetLink } from './auth.constants';

/**
 * Service used for authentication of users
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly configurationService: ConfigurationService,
  ) {}

  private async signToken(payload, secret: string, expirationTime: string): Promise<string> {
    return this.jwtService.sign(payload, {
      secret: await this.configurationService.get(secret),
      expiresIn: `${await this.configurationService.get(expirationTime)}s`,
    });
  }

  /**
   * Validate if user's credentials are valid
   *
   * @param username Fetch user by username
   * @param password Compare with hashed password of user found
   * @returns Boolean indicating if credentials are valid
   */
  async validateUser(username: string, password: string): Promise<UserEntity> {
    const user = await this.usersService.getByUsername(username);
    // No user with that username
    if (!user) {
      return null;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    // Passwords don't match
    if (!isMatch) {
      return null;
    }
    return user;
  }

  /**
   * Decode email payload from confirmation token
   *
   * @param token - Token to be decoded
   * @returns - Email from token
   */
  async decodeToken<T extends object>(token: string, secret: string): Promise<T> {
    const payload: T = await this.jwtService.verify(token, {
      secret: await this.configurationService.get(secret),
    });
    return payload;
  }

  async setAuthCookies(res: Response, payload: TokenPayload): Promise<void> {
    const secret = 'JWT_SECRET';
    const refreshSecret = 'JWT_REFRESH_SECRET';
    const expiration = 'JWT_EXPIRATION_TIME';
    const refreshExpiration = 'JWT_REFRESH_EXPIRATION_TIME';
    const domain = await this.configurationService.get('DOMAIN');
    // Set signed auth cookies
    const authToken = await this.signToken(payload, secret, expiration);
    const refreshToken = await this.signToken(payload, refreshSecret, refreshExpiration);
    const authCookie = Utils.createCookie(
      'Authentication',
      authToken,
      await this.configurationService.get(expiration),
      true,
      domain,
    );
    const refreshCookie = Utils.createCookie(
      'Refresh',
      refreshToken,
      await this.configurationService.get(refreshExpiration),
      true,
      domain,
    );
    const refreshExistCookie = Utils.createCookie(
      'RefreshExist',
      refreshToken,
      await this.configurationService.get(refreshExpiration),
      false,
      domain,
    );
    res.setHeader('Set-Cookie', [authCookie, refreshCookie, refreshExistCookie]);
    // Update refresh token in DB
    return this.usersService.setCurrentRefreshToken(refreshToken, payload.uuid);
  }

  async removeAuthCookies(res: Response, payload: TokenPayload): Promise<void> {
    // Get env vars
    const domain = await this.configurationService.get('DOMAIN');
    // Set logout cookies
    const logoutCookies = [
      Utils.createCookie('Authentication', '', '0', true, domain),
      Utils.createCookie('Refresh', '', '0', true, domain),
      Utils.createCookie('RefreshExist', '', '0', true, domain),
    ];
    res.setHeader('Set-Cookie', logoutCookies);
    // Remove refreshToken from user
    return this.usersService.removeRefreshToken(payload.uuid);
  }

  async sendEmailLink(payload: EmailDto, type: LinkMail) {
    // Get mail data depending on mail to be sent
    const mailData = type === LinkMail.confirm ? confirmationLink : resetLink;
    // Sign token and create mail
    const secret = await this.configurationService.get('JWT_EMAIL_SECRET');
    const expiration = await this.configurationService.get('JWT_EMAIL_EXPIRATION_TIME');
    const token = await this.signToken({ ...payload }, secret, expiration);
    const url = `${await this.configurationService.get('UI_URL')}${mailData.url}?token=${token}`;
    const text = `${mailData.content} ${url}`;
    const mail: Mail.Options = {
      from: 'contact@quickview-ai.com',
      subject: mailData.subject,
      to: payload.email,
      text,
    };
    // Send mail
    await this.emailService.sendMail(mail);
  }
}
