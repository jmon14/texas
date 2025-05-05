// NestJS
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

// External libraries
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { S3 } from 'aws-sdk';

// Entities
import FileEntity from 'src/database/entities/file.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileEntity)
    private publicFilesRepository: Repository<FileEntity>,
    private readonly configService: ConfigService,
  ) {}

  // TODO - Remove later as it is only needed during dev
  getFiles() {
    return this.publicFilesRepository.find({ relations: ['user'] });
  }

  getFilesById(id) {
    return this.publicFilesRepository.findOneBy({ id });
  }

  async uploadFile(dataBuffer: Buffer, filename: string, size, userId) {
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Body: dataBuffer,
        Key: `${uuid()}-${filename}`, // Generating a unique key, consider alternatives
      })
      .promise();

    const newFile = this.publicFilesRepository.create({
      key: uploadResult.Key,
      url: uploadResult.Location,
      name: filename,
      size,
      user: userId,
    });
    await this.publicFilesRepository.save(newFile);
    return newFile;
  }

  // TODO - Remove later as it is only needed during dev
  deleteFiles() {
    return this.publicFilesRepository.clear();
  }

  async deleteFilesById(fileId: string) {
    const file = await this.publicFilesRepository.findOne({ where: { id: fileId } });
    await this.publicFilesRepository.remove(file);
  }
}
