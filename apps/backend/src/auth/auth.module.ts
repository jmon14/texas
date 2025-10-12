// NestJS
import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

// Modules
import { UsersModule } from '../users/users.module';
import { EmailModule } from 'src/email/email.module';

// Services
import { AuthService } from './auth.service';

// Config
import { ConfigModule } from 'src/config/config.module';

// Strategies
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

// Controller
import { AuthController } from './auth.controller';

@Module({
  imports: [
    PassportModule,
    forwardRef(() => UsersModule),
    JwtModule.register({}),
    EmailModule,
    ConfigModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
