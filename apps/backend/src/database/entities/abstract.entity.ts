// NestJS
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

// External libraries
import { Exclude } from 'class-transformer';
import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Abstract entity to be inherited by other
 */
export abstract class AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ format: 'uuid' })
  public uuid: string;

  @CreateDateColumn()
  @ApiHideProperty()
  @Exclude()
  public createdAt: Date;

  @UpdateDateColumn()
  @ApiHideProperty()
  @Exclude()
  public updatedAt: Date;
}
