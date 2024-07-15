import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../service/auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token if login is successful', async () => {
      const result = { access_token: 'token' };
      jest.spyOn(authService, 'login').mockImplementation(async () => result);

      expect(await authController.login({ username: 'test', password: 'test' })).toBe(result);
    });

    it('should throw an UnauthorizedException if login fails', async () => {
      jest.spyOn(authService, 'login').mockImplementation(async () => {
        throw new UnauthorizedException();
      });

      try {
        await authController.login({ username: 'test', password: 'wrong' });
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
  });
});
