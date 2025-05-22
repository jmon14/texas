// NestJS
import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

// Guards
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';

// Interfaces
import { PayloadRequest } from 'src/auth/interfaces/request.interface';

// Services
import { FilesService } from 'src/files/files.service';

@Controller('files')
@ApiTags('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  // TODO - Remove later as it is only needed in dev
  @Get()
  getFiles() {
    return this.filesService.getFiles();
  }

  // TODO - Remove later as it is only needed in dev
  @Delete()
  deleteFiles() {
    return this.filesService.deleteFiles();
  }

  @Get(':id')
  getFilesById(@Param() { id }) {
    return this.filesService.getFilesById(id);
  }

  @Delete(':id')
  deleteFilesById(@Param() { id }) {
    return this.filesService.deleteFilesById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Request() { user }: PayloadRequest) {
    return this.filesService.uploadFile(file.buffer, file.originalname, file.size, user.uuid);
  }
}
