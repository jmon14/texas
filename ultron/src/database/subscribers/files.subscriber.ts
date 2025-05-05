// External libraries
import { DataSource, EntitySubscriberInterface, EventSubscriber, RemoveEvent } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';

// Entities
import FileEntity from 'src/database/entities/file.entity';

/**
 * Subscriber of events to update fields before insertion / update
 */
@EventSubscriber()
export class FilesSubscriber implements EntitySubscriberInterface<FileEntity> {
  constructor(public dataSource: DataSource, private configService: ConfigService) {
    dataSource.subscribers.push(this);
  }

  /**
   * Listens to FileEntity events
   *
   * @returns - typeof FileEntity
   */
  listenTo(): typeof FileEntity {
    return FileEntity;
  }

  /**
   * Remove file from AWS
   *
   * @param entity - Entity to be modified before deletion
   */
  async beforeRemove({ entity }: RemoveEvent<FileEntity>) {
    const s3 = new S3();
    await s3
      .deleteObject({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Key: entity.key,
      })
      .promise();
  }
}
