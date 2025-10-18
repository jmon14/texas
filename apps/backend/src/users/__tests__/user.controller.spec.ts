// NestJS
import { Test } from '@nestjs/testing';

// Service
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';

// Controller
import { UsersController } from 'src/users/users.controller';

// Mocks
import {
  mockedUsersService,
  mockedAuthService,
  mockResetPwdData,
  mockUserDto,
  mockRequest,
  mockMailDto,
  mockTokenData,
} from 'src/utils/mocks';

// Entity
import { UserEntity } from 'src/database/entities/user.entity';
import { HttpException } from '@nestjs/common';

describe('the user controller', () => {
  let usersController: UsersController;
  let userService: UsersService;
  let authService: AuthService;
  let user: UserEntity;

  beforeEach(async () => {
    user = new UserEntity();
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockedUsersService,
        },
        {
          provide: AuthService,
          useValue: mockedAuthService,
        },
      ],
    }).compile();

    usersController = module.get(UsersController);
    userService = module.get(UsersService);
    authService = module.get(AuthService);
  });

  describe('createUser', () => {
    it('should return created user', async () => {
      jest.spyOn(userService, 'createUser').mockResolvedValue(user);
      await expect(usersController.createUser(mockUserDto, mockRequest)).resolves.toEqual(user);
    });

    it('should throw HttpException if service fails', async () => {
      jest.spyOn(userService, 'createUser').mockRejectedValue(new Error());
      await expect(usersController.createUser(mockUserDto, mockRequest)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('resetPwd', () => {
    it('should decode token and update pwd', async () => {
      jest.spyOn(authService, 'decodeToken').mockResolvedValue(mockMailDto);
      await usersController.resetPwd(mockResetPwdData);
      expect(userService.updatePwd).toHaveBeenCalled();
    });

    it('should throw TokenExpiredError if token is expired', async () => {
      jest.spyOn(authService, 'decodeToken').mockRejectedValue({
        name: 'TokenExpiredError',
      });
      await expect(usersController.resetPwd(mockResetPwdData)).rejects.toThrow('Token expired');
    });

    it('should throwHttpException if service throws', async () => {
      jest.spyOn(authService, 'decodeToken').mockRejectedValue(new Error());
      await expect(usersController.resetPwd(mockResetPwdData)).rejects.toThrow(HttpException);
    });
  });

  describe('confirm', () => {
    it('should decode token and confirm email', async () => {
      jest.spyOn(authService, 'decodeToken').mockResolvedValue(mockMailDto);
      await usersController.confirm(mockTokenData);
      expect(userService.confirmEmail).toHaveBeenCalledWith(mockMailDto.email);
    });

    it('should throw TokenExpiredError if token is expired', async () => {
      jest.spyOn(authService, 'decodeToken').mockRejectedValue({
        name: 'TokenExpiredError',
      });
      await expect(usersController.confirm(mockTokenData)).rejects.toThrow('Token expired');
    });

    it('should throwHttpException if service throws', async () => {
      jest.spyOn(authService, 'decodeToken').mockRejectedValue(new Error());
      await expect(usersController.confirm(mockTokenData)).rejects.toThrow(HttpException);
    });
  });
});
