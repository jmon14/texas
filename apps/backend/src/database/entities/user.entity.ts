// NestJS
import { ApiHideProperty } from '@nestjs/swagger';

// External libraries
import { Column, Entity, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';

// Entities
import { AbstractEntity } from './abstract.entity';
import FileEntity from './file.entity';

/**
 * User entity to be persisted in DB
 */
@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity {
  @Column({
    unique: true,
    length: 20,
  })
  username: string;

  @Column({
    default: false,
  })
  active: boolean; // TODO - Rename to email-confirmed

  @Column({
    unique: true,
    length: 30,
  })
  email: string;

  @Column({
    length: 60,
  })
  @Exclude()
  @ApiHideProperty()
  password: string;

  @Column({
    nullable: true,
  })
  @Exclude()
  @ApiHideProperty()
  refreshToken?: string;

  @OneToMany(() => FileEntity, (file: FileEntity) => file.user)
  public files: FileEntity[];
}
