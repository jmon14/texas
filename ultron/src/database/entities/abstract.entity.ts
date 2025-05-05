// NestJS
import { ApiHideProperty } from '@nestjs/swagger';

// External libraries
import { Exclude } from 'class-transformer';
import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Abstract entity to be inherited by other
 */
export abstract class AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiHideProperty()
  @Exclude()
  public id: string;

  @CreateDateColumn()
  @ApiHideProperty()
  @Exclude()
  public createdAt: Date;

  @UpdateDateColumn()
  @ApiHideProperty()
  @Exclude()
  public updatedAt: Date;
}
