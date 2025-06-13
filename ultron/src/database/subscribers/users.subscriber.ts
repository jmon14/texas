// External libraries
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';

// Entities
import { UserEntity } from 'src/database/entities/user.entity';

// Utils
import { Utils } from 'src/utils/utils';

/**
 * Subscriber of events to update fields before insertion / update
 */
@EventSubscriber()
export class UsersSubscriber implements EntitySubscriberInterface<UserEntity> {
  constructor(public dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  /**
   * Listens to UserEntity events
   *
   * @returns - typeof UserEntity
   */
  listenTo(): typeof UserEntity {
    return UserEntity;
  }

  /**
   * Hash password before insert & lowercase email
   *
   * @param entity - Entity to be modified before insertion
   */
  async beforeInsert({ entity }: InsertEvent<UserEntity>) {
    if (entity.password) {
      entity.password = await Utils.generateHash(entity.password);
    }

    if (entity.email) {
      entity.email = entity.email.toLowerCase();
    }
  }

  /**
   * Hash password before update
   *
   * @param entity - Entity to be modified before update
   * @param databaseEntity - Entity in database
   */
  async beforeUpdate({ entity, databaseEntity }: UpdateEvent<UserEntity>) {
    if (entity.password) {
      const password = await Utils.generateHash(entity.password);

      if (password !== databaseEntity?.password) {
        entity.password = password;
      }
    }

    if (entity.email) {
      entity.email = entity.email.toLowerCase();
    }
  }
}
