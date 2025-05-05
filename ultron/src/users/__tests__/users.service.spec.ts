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
import * as bcrypt from 'bcrypt';

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
    it('should return the user', () => {
      findOne.mockResolvedValue(user);
      expect(usersService.getByUsername('testname')).resolves.toEqual(user);
    });
  });

  describe('getByIdRefresh', () => {
    it('should return null if user not found', () => {
      findOne.mockResolvedValue(null);
      expect(usersService.getByIdRefresh('refreshToken', 'id')).resolves.toBeNull();
    });

    it('should return null if user found but refresh token doesnt match', () => {
      findOne.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => false);
      expect(usersService.getByIdRefresh('refreshToken', 'id')).resolves.toBeNull();
    });

    it('should return user if found and refresh token match', () => {
      findOne.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);
      expect(usersService.getByIdRefresh('refreshToken', 'id')).resolves.toEqual(user);
    });
  });

  describe('createUser', () => {
    it('should save user and return it', () => {
      save.mockResolvedValue(user);
      expect(usersService.createUser(mockUserDto)).resolves.toEqual(user);
    });

    it('should throw unique violation error', () => {
      save.mockRejectedValue({ code: '23505', detail: 'username' });
      expect(usersService.createUser(mockUserDto)).rejects.toThrow('Username already exists');
    });
  });

  describe('confirmEmail', () => {
    it('should throw email already confirmed error', () => {
      user.active = true;
      findOneBy.mockResolvedValue(user);
      expect(usersService.confirmEmail('test@test.com')).rejects.toThrow('Email already confirmed');
    });

    it('should update user in repository if its not active', async () => {
      user.active = false;
      findOneBy.mockResolvedValue(user);

      await usersService.confirmEmail(testEmail);
      expect(update).toHaveBeenCalled();
    });
  });
});
