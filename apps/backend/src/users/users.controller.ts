// NestJS
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Controller,
  HttpCode,
  Request,
  Delete,
  Body,
  Post,
  Get,
  UseGuards,
  Param,
} from '@nestjs/common';
import { ApiBody, ApiTags, ApiParam } from '@nestjs/swagger';

// Services
import { AuthService } from '../auth/auth.service';
import { UsersService } from './users.service';

// Entities
import { UserEntity } from '../database/entities/user.entity';
import FileEntity from '../database/entities/file.entity';

// DTOs
import EmailDto from './dtos/email.dto';
import TokenDto from './dtos/confirm-email.dto';
import { RegisterDto } from './dtos/user.dto';
import { ResetPwdDto } from './dtos/reset-password.dto';

// Constants
import { LinkMail } from '../auth/auth.constants';

// Guards
import JwtAuthGuard from '../auth/guards/jwt-auth.guard';

// Interfaces
import { PayloadRequest } from '../auth/interfaces/request.interface';

/**
 * Controller for user related requests
 */
@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}

  // TODO - Remove later as it is only needed in dev
  @Get()
  getUsers(): Promise<UserEntity[]> {
    return this.userService.getUsers();
  }

  // TODO - Remove later as it is only needed in dev
  @Delete()
  deleteUsers() {
    return this.userService.deleteUsers();
  }

  @Delete(':uuid')
  @ApiParam({ name: 'uuid', description: 'User UUID' })
  deleteUserByUuid(@Param() { uuid }) {
    return this.userService.deleteUserById(uuid);
  }

  @Post('create')
  @ApiBody({
    description: 'Create user from payload, send verification email and return created user',
    type: RegisterDto,
  })
  async createUser(@Body() createUserDto: RegisterDto, @Request() req): Promise<UserEntity> {
    try {
      const user = await this.userService.createUser(createUserDto);
      // Set Auth cookies to authenticate user
      await this.authService.setAuthCookies(req.res, { uuid: user.uuid });
      // Send verification email
      this.authService.sendEmailLink({ email: user.email }, LinkMail.confirm);
      // Return user data
      return user;
    } catch (err) {
      if (err.message) {
        throw new BadRequestException(err.message);
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('reset-pwd')
  @HttpCode(200)
  @ApiBody({
    description: 'Reset user password from payload',
    type: ResetPwdDto,
  })
  async resetPwd(@Body() resetData: ResetPwdDto) {
    try {
      const payload = await this.authService.decodeToken<EmailDto>(
        resetData.token,
        'JWT_EMAIL_SECRET',
      );
      await this.userService.updatePwd(resetData.password, payload.email);
    } catch (err) {
      if (err?.name === 'TokenExpiredError') {
        throw new BadRequestException('Token expired');
      }
      throw new HttpException(
        err.message ?? 'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('confirm')
  @HttpCode(200)
  @ApiBody({
    type: TokenDto,
    description: 'Confirm email by decoding token and updating user in DB',
  })
  async confirm(@Body() confirmationData: TokenDto) {
    try {
      const payload = await this.authService.decodeToken<EmailDto>(
        confirmationData.token,
        'JWT_EMAIL_SECRET',
      );
      await this.userService.confirmEmail(payload.email);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new BadRequestException('Token expired');
      }
      if (err.message === 'Email already confirmed') {
        throw new BadRequestException(err.message);
      }
      throw new HttpException(
        err.message ?? 'Invalid confirmation token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('files')
  async getUserFiles(@Request() { user }: PayloadRequest): Promise<FileEntity[]> {
    return this.userService.getUserFiles(user.uuid);
  }
}
