// NestJS
import { Module } from '@nestjs/common';

// Services
import { EmailService } from './email.service';
import { SesStrategy } from './strategies/ses.strategy';
import { EtherealStrategy } from './strategies/ethereal.strategy';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [ConfigModule],
  providers: [EmailService, SesStrategy, EtherealStrategy],
  exports: [EmailService],
})
export class EmailModule {}
