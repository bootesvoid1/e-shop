// apps/user/src/user.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// Use relative paths for DTOs and Entities
import { RegisterUserDto } from '../../../libs/shared/src/dtos/user/register_user.dto';
import { LoginUserDto } from '../../../libs/shared/src/dtos/user/user.dto';
// Import other DTOs if needed for other tests
// import { VerifyUserDto } from '../../../libs/shared/src/dtos/user/verify_user.dto';
// import { ResetPasswordDto } from '../../../libs/shared/src/dtos/user/reset_password.dto';
import { UsersEntity } from '../../../libs/shared/src/common/databases/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { MailService } from './mail/mail.service'; // Assuming MailService is local
import { UnauthorizedException } from '@nestjs/common';
// Import other exceptions if needed
// import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt'; // Import bcrypt to mock it

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<UsersEntity>;
  let mailService: MailService;
  let jwtService: JwtService;

  // --- Mock Repository and Service Dependencies ---
  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(), // Add if needed for other tests
    // Add other repository methods as needed
  };

  const mockMailService = {
    send2FACode: jest.fn(),
    sendResetLink: jest.fn(),
    // Add other mail service methods as needed
  };

  const mockJwtService = {
    sign: jest.fn(),
    // Add other jwt service methods as needed
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UsersEntity),
          useValue: mockUserRepository,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UsersEntity>>(getRepositoryToken(UsersEntity));
    mailService = module.get<MailService>(MailService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    // --- FIX 1: Include ALL required fields for RegisterUserDto ---
    // Based on the error, these are firstName, lastName, email, password, phoneNumber, address, role
    const registerDto: RegisterUserDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      phoneNumber: '+1234567890', // Add required field
      address: '123 Main St, City, Country', // Add required field
      role: 'user', // Add required field (adjust value as needed based on your enum/definition)
    };

    const hashedPassword = 'hashed_password_123_mock';
    const createdUserEntity = {
      id: 'mock-user-id-1',
      ...registerDto,
      password: hashedPassword, // This will be the hashed version
      isTwoFactorEnabled: false,
      twoFactorCode: null,
      twoFactorCodeExpiresAt: null,
      passwordResetToken: null,
      passwordResetTokenExpiresAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      // Add other fields from UsersEntity if they are part of the saved object and checked
    };

    it('should create a user with hashed password', async () => {
      // --- FIX 2: Correctly mock bcrypt.hash with compatible types ---
      // Use 'mockResolvedValue' with 'any' cast or ensure the return type matches bcrypt.hash
      // bcrypt.hash returns Promise<string>, so mockResolvedValue(string) should generally work.
      // If TypeScript still complains, 'any' cast is a pragmatic solution for mocks.
      jest.spyOn(bcrypt, 'hash').mockImplementation(async () => hashedPassword); // Option 1: mockImplementation
      // OR
      // jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as any); // Option 2: cast to any

      mockUserRepository.create.mockReturnValue(createdUserEntity); // Mock the entity creation
      mockUserRepository.save.mockResolvedValue(createdUserEntity); // Mock the save operation

      const result = await service.createUser(registerDto);

      // --- Assertions ---
      // Check bcrypt.hash was called correctly
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      // Check repository methods
      expect(userRepository.create).toHaveBeenCalledWith(expect.objectContaining({
         // Check that the password passed to 'create' is the hashed one
        password: hashedPassword,
      }));
      expect(userRepository.save).toHaveBeenCalledWith(createdUserEntity);
      // Check the result
      expect(result).toEqual(createdUserEntity);
      expect(result.password).toBe(hashedPassword); // Ensure password was hashed
    });
  });

  describe('loginUser', () => {
    const loginUserDto: LoginUserDto = {
      email: 'john.doe@example.com',
      password: 'correct_password_123',
    };

    const mockUserFromDb = {
      id: 'mock-user-id-1',
      email: 'john.doe@example.com',
      password: 'hashed_password_from_db_mock', // This is what's stored
      firstName: 'John',
      lastName: 'Doe',
      isTwoFactorEnabled: false,
      // ... other relevant user fields for login
    };

    it('should login user successfully', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUserFromDb);
      // --- FIX 2 (for bcrypt.compare): Ensure correct mock type ---
      // bcrypt.compare returns Promise<boolean>
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true); // Option 1: mockImplementation
      // OR
      // jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as any); // Option 2: cast to any

      const mockJwtToken = 'mock.jwt.token.here';
      mockJwtService.sign.mockReturnValue(mockJwtToken);

      const result = await service.loginUser(loginUserDto);

      // --- Assertions ---
      expect(bcrypt.compare).toHaveBeenCalledWith(loginUserDto.password, mockUserFromDb.password);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email: loginUserDto.email } });
      expect(jwtService.sign).toHaveBeenCalledWith(
        { sub: mockUserFromDb.id, email: mockUserFromDb.email },
        { expiresIn: '24h', secret: 'secret' }, // Match your service implementation
      );
      expect(result).toEqual({
        token: mockJwtToken,
        user: expect.objectContaining({
          id: mockUserFromDb.id,
          email: mockUserFromDb.email,
          firstName: mockUserFromDb.firstName,
          lastName: mockUserFromDb.lastName,
          // Ensure password is not included in the returned user object
        }),
      });
      // Specific check for password exclusion (if your service logic ensures this)
      expect((result.user as any)).not.toHaveProperty('password');
    });

    it('should throw UnauthorizedException for invalid credentials (user not found)', async () => {
      mockUserRepository.findOne.mockResolvedValue(null); // Simulate user not found

      await expect(service.loginUser(loginUserDto)).rejects.toThrow(UnauthorizedException);
      await expect(service.loginUser(loginUserDto)).rejects.toThrow('Invalid credentials');

      // Ensure bcrypt.compare was NOT called if user is not found
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException for invalid credentials (wrong password)', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUserFromDb);
      // Mock bcrypt.compare to return false for incorrect password
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false); // Option 1
      // OR
      // jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as any); // Option 2

      await expect(service.loginUser(loginUserDto)).rejects.toThrow(UnauthorizedException);
      await expect(service.loginUser(loginUserDto)).rejects.toThrow('Invalid credentials');

      // Ensure bcrypt.compare was called
      expect(bcrypt.compare).toHaveBeenCalledWith(loginUserDto.password, mockUserFromDb.password);
    });
  });

 
});
