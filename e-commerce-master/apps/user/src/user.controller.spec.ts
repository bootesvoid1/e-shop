// apps/user/src/user.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
// --- FIX: Use relative paths for DTOs ---
import { RegisterUserDto } from '../../../libs/shared/src/dtos/user/register_user.dto';
import { LoginUserDto } from '../../../libs/shared/src/dtos/user/user.dto';
import { VerifyUserDto } from '../../../libs/shared/src/dtos/user/verify_user.dto';
import { ResetPasswordDto } from '../../../libs/shared/src/dtos/user/reset_password.dto';
// --- End of FIX ---

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  const mockUserService = {
    getHello: jest.fn(),
    loginUser: jest.fn(),
    createUser: jest.fn(),
    verifyUser: jest.fn(),
    requestPasswordReset: jest.fn(),
    resetPassword: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      mockUserService.getHello.mockReturnValue('Hello World!');

      const result = controller.getHello();

      expect(result).toBe('Hello World!');
      expect(userService.getHello).toHaveBeenCalled();
    });
  });

  describe('getUserByEmail (auth_login)', () => {
    it('should call userService.loginUser', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'john.doe@example.com',
        password: 'password123',
      };
      const expectedResult = { token: 'jwt_token', user: {} };

      mockUserService.loginUser.mockResolvedValue(expectedResult);

      const result = await controller.getUserByEmail(loginUserDto);

      expect(userService.loginUser).toHaveBeenCalledWith(loginUserDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('createUser (auth_register)', () => {
    it('should call userService.createUser', async () => {
      // --- FIX: Include all required fields for RegisterUserDto ---
      // Based on previous errors, it likely requires phoneNumber, address, role
      const registerUserDto: RegisterUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        phoneNumber: '+1234567890', // Add required field
        address: '123 Main St, City, Country', // Add required field
        role: 'user', // Add required field
      };
      // --- End of FIX ---
      // Note: The actual returned user will have the hashed password, not 'hashed' literal
      const expectedResult = { id: '1', ...registerUserDto, password: 'hashed_mocked_password' }; // Adjust expectation

      mockUserService.createUser.mockResolvedValue(expectedResult);

      const result = await controller.createUser(registerUserDto);

      expect(userService.createUser).toHaveBeenCalledWith(registerUserDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('verifyUser (auth_2fa)', () => {
    it('should call userService.verifyUser', async () => {
      const verifyUserDto: VerifyUserDto = {
        id: '1',
        code: '123456',
      };
      const expectedResult = { token: 'jwt_token_after_2fa', user: {} };

      mockUserService.verifyUser.mockResolvedValue(expectedResult);

      const result = await controller.verifyUser(verifyUserDto);

      expect(userService.verifyUser).toHaveBeenCalledWith(verifyUserDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('requestPassword (auth-forgot)', () => {
    it('should call userService.requestPasswordReset', async () => {
      const email = 'john.doe@example.com';
      const expectedResult = { message: 'Reset link sent if the email exists.', email }; // Match service message

      mockUserService.requestPasswordReset.mockResolvedValue(expectedResult);

      const result = await controller.requestPassword(email);

      expect(userService.requestPasswordReset).toHaveBeenCalledWith(email);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('resetPassword (auth_reset)', () => {
    it('should call userService.resetPassword', async () => {
      const resetPasswordDto: ResetPasswordDto = {
        token: 'reset_token_123',
        password: 'new_password_123',
      };
      // --- FIX: Result should likely be the updated user object or similar ---
      const expectedResult = { id: '1', email: 'john.doe@example.com', /* ...other user fields... */ };

      mockUserService.resetPassword.mockResolvedValue(expectedResult);
      // --- End of FIX ---

      const result = await controller.resetPassword(resetPasswordDto);

      expect(userService.resetPassword).toHaveBeenCalledWith(resetPasswordDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll (user_findAll)', () => {
    it('should call userService.findAll', async () => {
      const payload = {
        page: 1,
        limit: 10,
        query: { searchTerm: 'John' },
      };
      const expectedResult = {
        data: [{ id: '1', firstName: 'John' }],
        count: 1,
      };

      mockUserService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(payload);

      expect(userService.findAll).toHaveBeenCalledWith(payload);
      expect(result).toEqual(expectedResult);
    });
  });
});
