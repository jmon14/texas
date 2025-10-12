// NestJS
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Services
import { FilesService } from 'src/files/files.service';

// Controllers
import { FilesController } from 'src/files/files.controller';

// Entities
import FileEntity from 'src/database/entities/file.entity';
import { FilesSubscriber } from 'src/database/subscribers/files.subscriber';

// Config
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity]), ConfigModule],
  providers: [FilesService, FilesSubscriber],
  exports: [FilesService],
  controllers: [FilesController],
})
export class FilesModule {}
