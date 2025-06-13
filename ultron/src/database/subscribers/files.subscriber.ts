// External libraries
import { DataSource, EntitySubscriberInterface, EventSubscriber, RemoveEvent } from 'typeorm';
import { S3 } from 'aws-sdk';

// Entities
import FileEntity from 'src/database/entities/file.entity';

// Services
import { ConfigurationService } from '../../config/configuration.service';

/**
 * Subscriber of events to update fields before insertion / update
 */
@EventSubscriber()
export class FilesSubscriber implements EntitySubscriberInterface<FileEntity> {
  constructor(public dataSource: DataSource, private configurationService: ConfigurationService) {
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
    const bucketName = await this.configurationService.get('AWS_PUBLIC_BUCKET_NAME');
    await s3
      .deleteObject({
        Bucket: bucketName,
        Key: entity.key,
      })
      .promise();
  }
}
