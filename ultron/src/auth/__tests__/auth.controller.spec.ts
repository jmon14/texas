// NestJS
import { Test } from '@nestjs/testing';
import { LinkMail } from 'src/auth/auth.constants';

// Controller
import { AuthController } from 'src/auth/auth.controller';

// Services
import { AuthService } from 'src/auth/auth.service';

// Mocks
import { mockedAuthService, mockPayloadReq, mockMailDto, mockUserReq } from 'src/utils/mocks';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockedAuthService,
        },
      ],
    }).compile();

    authController = module.get(AuthController);
    authService = module.get(AuthService);
  });

  describe('login', () => {
    it('should return user provided in request and set auth cookies', () => {
      expect(authController.login(mockUserReq)).resolves.toEqual(mockUserReq.user);

      const payload = { id: mockUserReq.user.id };
      expect(authService.setAuthCookies).toHaveBeenCalledWith(mockUserReq.res, payload);
    });

    it('should throw when authService fails', () => {
      jest.spyOn(authService, 'setAuthCookies').mockRejectedValue(new Error());
      expect(authController.login(mockUserReq)).rejects.toThrow();
    });
  });

  describe('refresh', () => {
    it('should return user provided in request and set auth cookies', () => {
      expect(authController.refresh(mockUserReq)).resolves.toEqual(mockUserReq.user);

      const payload = { id: mockUserReq.user.id };
      expect(authService.setAuthCookies).toHaveBeenCalledWith(mockUserReq.res, payload);
    });

    it('should throw when authService fails', () => {
      jest.spyOn(authService, 'setAuthCookies').mockRejectedValue(new Error());
      expect(authController.refresh(mockUserReq)).rejects.toThrow();
    });
  });

  describe('logout', () => {
    it('should remove auth cookies', async () => {
      await authController.logout(mockPayloadReq);
      expect(authService.removeAuthCookies).toHaveBeenCalledWith(
        mockPayloadReq.res,
        mockPayloadReq.user,
      );
    });
  });

  describe('sendResetEmail', () => {
    it('should call sendResetLink with resetData email', () => {
      authController.sendResetEmail(mockMailDto);
      expect(authService.sendEmailLink).toHaveBeenCalledWith(mockMailDto, LinkMail.reset);
    });
  });
});
