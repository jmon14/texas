// NestJS
import { Module } from '@nestjs/common';

// Feature module
import { AuthModule } from 'src/auth/auth.module';
import { EmailModule } from 'src/email/email.module';
import { UsersModule } from 'src/users/users.module';
import { FilesModule } from 'src/files/files.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    EmailModule,
    AuthModule,
    FilesModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
