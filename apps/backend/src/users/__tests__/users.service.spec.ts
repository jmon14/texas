// NestJS
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

// Services
import { UsersService } from 'src/users/users.service';

// Entities
import { UserEntity } from 'src/database/entities/user.entity';

// Mocks
import { mockUserDto, testEmail } from 'src/utils/mocks';

// External libraries

describe('The UsersService', () => {
  let usersService: UsersService;
  const findOneBy = jest.fn();
  const findOne = jest.fn();
  const update = jest.fn();
  const create = jest.fn();
  const save = jest.fn();
  let user: UserEntity;

  beforeEach(async () => {
    user = new UserEntity();
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOneBy,
            findOne,
            update,
            create,
            save,
          },
        },
      ],
    }).compile();
    usersService = await module.get(UsersService);
  });

  describe('getByUsername', () => {
    it('should return the user', async () => {
      findOne.mockResolvedValue(user);
      await expect(usersService.getByUsername('testname')).resolves.toEqual(user);
    });
  });

  describe('getByIdRefresh', () => {
    it('should return null if user not found', async () => {
      findOne.mockResolvedValue(null);
      const result = await usersService.getByIdRefresh('refreshToken', 'id');
      expect(result).toBeNull();
    });

    it('should return null if user found but refresh token doesnt match', async () => {
      user.refreshToken = 'differentToken';
      findOne.mockResolvedValue(user);
      const result = await usersService.getByIdRefresh('refreshToken', 'id');
      expect(result).toBeNull();
    });

    it('should return user if found and refresh token match', async () => {
      user.refreshToken = 'refreshToken';
      findOne.mockResolvedValue(user);
      const result = await usersService.getByIdRefresh('refreshToken', 'id');
      expect(result).toEqual(user);
    });
  });

  describe('createUser', () => {
    it('should save user and return it', async () => {
      save.mockResolvedValue(user);
      await expect(usersService.createUser(mockUserDto)).resolves.toEqual(user);
    });

    it('should throw unique violation error', async () => {
      save.mockRejectedValue({ code: '23505', detail: 'username' });
      await expect(usersService.createUser(mockUserDto)).rejects.toThrow('Username already exists');
    });
  });

  describe('confirmEmail', () => {
    it('should throw email already confirmed error', async () => {
      user.active = true;
      findOneBy.mockResolvedValue(user);
      await expect(usersService.confirmEmail('test@test.com')).rejects.toThrow(
        'Email already confirmed',
      );
    });

    it('should update user in repository if its not active', async () => {
      user.active = false;
      findOneBy.mockResolvedValue(user);

      await usersService.confirmEmail(testEmail);
      expect(update).toHaveBeenCalled();
    });
  });
});
