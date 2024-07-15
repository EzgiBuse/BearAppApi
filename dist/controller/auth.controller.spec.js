"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("../service/auth.service");
const common_1 = require("@nestjs/common");
describe('AuthController', () => {
    let authController;
    let authService;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [auth_controller_1.AuthController],
            providers: [
                {
                    provide: auth_service_1.AuthService,
                    useValue: {
                        login: jest.fn(),
                    },
                },
            ],
        }).compile();
        authController = module.get(auth_controller_1.AuthController);
        authService = module.get(auth_service_1.AuthService);
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
                throw new common_1.UnauthorizedException();
            });
            try {
                await authController.login({ username: 'test', password: 'wrong' });
            }
            catch (error) {
                expect(error).toBeInstanceOf(common_1.UnauthorizedException);
            }
        });
    });
});
//# sourceMappingURL=auth.controller.spec.js.map