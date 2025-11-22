// NestJS
import { Module } from '@nestjs/common';

// Sentry
import { SentryModule } from '@sentry/nestjs/setup';

// Controllers
import { AppController } from './app.controller';

// Feature module
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';
import { DatabaseModule } from './database/database.module';
import { RangesModule } from './ranges/ranges.module';
import { ScenariosModule } from './scenarios/scenarios.module';

@Module({
  imports: [
    SentryModule.forRoot(),
    DatabaseModule,
    UsersModule,
    EmailModule,
    AuthModule,
    FilesModule,
    RangesModule,
    ScenariosModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
