// NestJS
import { Module } from '@nestjs/common';

// Services
import { EmailService } from './email.service';

@Module({
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
