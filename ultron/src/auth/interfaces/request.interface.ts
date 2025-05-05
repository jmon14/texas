// External libraries
import { Request } from 'express';

// Entities
import { UserEntity } from '../../database/entities/user.entity';

// Interfaces
import { TokenPayload } from './token.interface';

export interface UserRequest extends Request {
  user: UserEntity;
}

export interface PayloadRequest extends Request {
  user: TokenPayload;
}
