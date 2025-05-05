// Nest
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// External libraries
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

// Entities
import { UserEntity } from 'src/database/entities/user.entity';

// DTOs
import { UserDto } from 'src/users/dtos/user.dto';

// Constants
import { PostgresErrorCode } from 'src/utils/constants';
import FileEntity from 'src/database/entities/file.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  getUsers() {
    return this.userRepository.find({ relations: ['files'] });
  }

  // TODO - Remove later as it is only needed during dev
  deleteUsers() {
    return this.userRepository.delete({});
  }

  deleteUserById(id: string) {
    return this.userRepository.delete({ id });
  }

  /**
   * Obtain user by fetching with username
   *
   * @param username - Username to be fetched
   * @returns - User entity
   */
  async getByUsername(username: string): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { username } });
  }

  /**
   * Get user with id and match refresh token
   *
   * @param refreshToken - Refresh token to compare
   * @param id - Get user with id
   * @returns - User with id and refresh token if matched
   */
  async getByIdRefresh(refreshToken: string, id: string): Promise<UserEntity> {
    // Fetch user by id
    const user = await this.userRepository.findOne({ where: { id } });
    // Return null if user not found
    if (!user) {
      return null;
    }
    // Compare refresh token stored
    const isRefreshTokenMatching = await bcrypt.compare(refreshToken, user.refreshToken);
    // If refresh token matches return user data
    if (isRefreshTokenMatching) {
      return user;
    }
    return null;
  }

  /**
   * Create user in DB and return it
   *
   * @param createUserDto - Dto for user to be created
   * @returns - User saved
   */
  async createUser(createUserDto: UserDto): Promise<UserEntity> {
    try {
      const newUser = this.userRepository.create(createUserDto);
      const user = await this.userRepository.save(newUser);
      return user;
    } catch (error) {
      if (error.code === PostgresErrorCode.UniqueViolation && error.detail) {
        throw new Error(
          `${error.detail.includes('username') ? 'Username' : 'Email'} already exists`,
        );
      }
      throw error;
    }
  }

  /**
   * Get user with email, activate it or throw error if it is active already
   *
   * @param email - Find user by email
   */
  async confirmEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (user.active) {
      throw new Error('Email already confirmed');
    }
    await this.userRepository.update({ email }, { active: true });
  }

  /**
   * Update refresh token in DB in user with id
   *
   * @param refreshToken - Refresh token in DB
   * @param id - Find user by id
   */
  async setCurrentRefreshToken(refreshToken: string, id: string) {
    await this.userRepository.update({ id }, { refreshToken });
  }

  /**
   * Remove refresh token from user when loggin out
   *
   * @param id - id from user to be updated
   */
  async removeRefreshToken(id: string) {
    await this.userRepository.update({ id }, { refreshToken: null });
  }

  /**
   * Update password in DB
   *
   * @param pwd - Password to be updated
   * @param email - User email to be updated
   */
  async updatePwd(pwd: string, email: string) {
    await this.userRepository.update({ email }, { password: pwd });
  }

  async getUserFiles(id: string): Promise<FileEntity[]> {
    const user = await this.userRepository.findOne({ where: { id }, relations: ['files'] });
    return user.files;
  }
}
