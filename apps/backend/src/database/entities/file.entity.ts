// External libraries
import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToOne } from 'typeorm';

// Entities
import { AbstractEntity } from './abstract.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'files' })
class FileEntity extends AbstractEntity {
  @Column()
  public url: string;

  @Column()
  @Exclude()
  @ApiHideProperty()
  public key: string;

  @Column({
    default: 0,
  })
  public size: number;

  @Column({
    nullable: true,
  })
  public name: string;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.files, { onDelete: 'CASCADE' })
  public user: string;
}

export default FileEntity;
