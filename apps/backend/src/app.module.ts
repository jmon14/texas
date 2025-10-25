// NestJS
import { Module } from '@nestjs/common';

// Sentry
import { SentryModule } from '@sentry/nestjs/setup';

// Controllers
import { AppController } from './app.controller';

// Feature module
import { AuthModule } from 'src/auth/auth.module';
import { EmailModule } from 'src/email/email.module';
import { UsersModule } from 'src/users/users.module';
import { FilesModule } from 'src/files/files.module';
import { DatabaseModule } from 'src/database/database.module';
import { RangesModule } from 'src/ranges/ranges.module';

@Module({
  imports: [
    SentryModule.forRoot(),
    DatabaseModule,
    UsersModule,
    EmailModule,
    AuthModule,
    FilesModule,
    RangesModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
