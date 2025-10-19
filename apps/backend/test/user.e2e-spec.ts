// NestJS
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
  HttpStatus,
} from '@nestjs/common';

// Modules
import { AppModule } from 'src/app.module';

// External libraries
import * as request from 'supertest';
import { Repository } from 'typeorm';

// Services
import { EmailService } from 'src/email/email.service';

// Entities
import { UserEntity } from 'src/database/entities/user.entity';

// Mocks
import { mockRegisterDto, testEmail } from 'src/utils/mocks';

// Constants
import { confirmationLink } from 'src/auth/auth.constants';

// DTOs
import { ResetPwdDto } from 'src/users/dtos/reset-password.dto';
import TokenDto from 'src/users/dtos/confirm-email.dto';

describe('App (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let emailService: EmailService;
  let configService: ConfigService;
  let repository: Repository<UserEntity>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      // Mock email service so no emails are sent during testing
      .overrideProvider(EmailService)
      .useValue({
        sendMail: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    const reflector = app.get(Reflector);
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

    await app.init();

    jwtService = moduleFixture.get(JwtService);
    emailService = moduleFixture.get(EmailService);
    configService = moduleFixture.get(ConfigService);
    repository = moduleFixture.get('UserEntityRepository');
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    // Clean users table
    repository.delete({});
  });

  describe('UsersController', () => {
    it('should handle fetch, create, delete users', async () => {
      let res: request.Response;
      let confirmDto: TokenDto;
      let pwdDto: ResetPwdDto;
      // There should be no users at the start
      const server = app.getHttpServer();
      await request(server).get('/users/').expect(HttpStatus.OK).expect([]);
      // Create new user
      res = await request(server)
        .post('/users/create/')
        .expect('Content-Type', /json/)
        .send(mockRegisterDto)
        .expect(HttpStatus.CREATED);
      // It should return created entity
      expect(res.body).toEqual(
        expect.objectContaining<Partial<UserEntity>>({
          username: 'testuser',
          email: testEmail,
          active: false,
        }),
      );
      // It should set 3 auth cookies
      expect(res.header['set-cookie']).toHaveLength(3);
      // It should call email service with mail options
      expect(emailService.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'test@allinrange.com',
          subject: confirmationLink.subject,
          to: testEmail,
        }),
      );
      // It should return single user
      res = await request(server)
        .get('/users/')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK);
      expect(res.body).toHaveLength(1);
      // It should error if trying to create user with duplicate username
      res = await request(server)
        .post('/users/create/')
        .expect('Content-Type', /json/)
        .send(mockRegisterDto)
        .expect(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(expect.objectContaining({ message: 'Username already exists' }));
      // It should error if trying to create user with duplicate email
      res = await request(server)
        .post('/users/create/')
        .expect('Content-Type', /json/)
        .send({ ...mockRegisterDto, username: 'newusername' })
        .expect(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(expect.objectContaining({ message: 'Email already exists' }));
      // It should update pwd
      const token = jwtService.sign(
        { email: 'test@test.com' },
        { secret: configService.get('JWT_EMAIL_SECRET') },
      );
      pwdDto = {
        password: 'newpassword',
        token,
      };
      res = await request(server).post('/users/reset-pwd/').send(pwdDto).expect(HttpStatus.OK);
      // It should throw expiration token error
      const failToken = jwtService.sign(
        { email: testEmail },
        { secret: configService.get('JWT_EMAIL_SECRET'), expiresIn: 0 },
      );
      pwdDto = {
        password: 'otherpassword',
        token: failToken,
      };
      res = await request(server)
        .post('/users/reset-pwd/')
        .send(pwdDto)
        .expect(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(expect.objectContaining({ message: 'Token expired' }));
      // It should confirm user
      confirmDto = {
        token,
      };
      await request(server).post('/users/confirm/').send(confirmDto).expect(HttpStatus.OK);
      res = await request(server).get('/users/');
      const user: UserEntity = res.body[0];
      expect(user.active).toBeTruthy();
      // It should throw if user is already active
      res = await request(server)
        .post('/users/confirm/')
        .send(confirmDto)
        .expect(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(expect.objectContaining({ message: 'Email already confirmed' }));
      // It should throw expiration token error
      confirmDto = {
        token: failToken,
      };
      res = await request(server)
        .post('/users/confirm/')
        .send(confirmDto)
        .expect(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(expect.objectContaining({ message: 'Token expired' }));
    });
  });
});
