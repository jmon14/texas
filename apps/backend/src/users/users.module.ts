// NestJS
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Feature modules
import { AuthModule } from '../auth/auth.module';

// Services
import { UsersService } from './users.service';

// Controller
import { UsersController } from './users.controller';

// Entities
import { UserEntity } from '../database/entities/user.entity';

// Subscriber
import { UsersSubscriber } from '../database/subscribers/users.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), forwardRef(() => AuthModule)],
  providers: [UsersService, UsersSubscriber],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
