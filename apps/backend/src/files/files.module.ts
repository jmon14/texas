// NestJS
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Services
import { FilesService } from './files.service';

// Controllers
import { FilesController } from './files.controller';

// Entities
import FileEntity from '../database/entities/file.entity';
import { FilesSubscriber } from '../database/subscribers/files.subscriber';

// Config
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity]), ConfigModule],
  providers: [FilesService, FilesSubscriber],
  exports: [FilesService],
  controllers: [FilesController],
})
export class FilesModule {}
