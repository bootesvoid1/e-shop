// apps/user/test/user.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ClientsModule, Transport, ClientProxy } from '@nestjs/microservices';
import { INestApplication } from '@nestjs/common';
import { of, firstValueFrom } from 'rxjs';
// --- Use @app/shared aliases for DTOs ---
import { RegisterUserDto } from '@app/shared/dtos/user/register_user.dto';
import { LoginUserDto } from '@app/shared/dtos/user/user.dto';
import { VerifyUserDto } from '@app/shared/dtos/user/verify_user.dto';
import { ResetPasswordDto } from '@app/shared/dtos/user/reset_password.dto';
// --- End of @app/shared aliases ---
import { UserController } from '../src/user.controller';
import { UserService } from '../src/user.service'; // Import for provider setup

// Define a unique name for the client used to send messages *to* this controller/service
// This should ideally match the name used when creating the microservice in main.ts
const USER_SERVICE_CLIENT_NAME = 'USER_SERVICE_CLIENT_FOR_TESTS';

describe('UserController (Microservice Client Test)', () => {
  let client: ClientProxy; // Client to *send* messages to the UserController (SUT)
  let app: TestingModule; // The testing module

  // --- Mock data for tests ---
  const mockRegisterUserDto: RegisterUserDto = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe.e2e@example.com',
    password: 'securePassword123',
    phoneNumber: '+1234567890',
    address: '123 Main St, City, Country',
    role: 'user', // Adjust if needed
    // Add other required fields if any
  };

  const mockCreatedUser = {
    id: 'user-e2e-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe.e2e@example.com',
    // password should be excluded from the response
    phoneNumber: '+1234567890',
    address: '123 Main St, City, Country',
    role: 'user',
    isTwoFactorEnabled: false,
    twoFactorCode: null,
    twoFactorCodeExpiresAt: null,
    passwordResetToken: null,
    passwordResetTokenExpiresAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    // ... other relevant user fields
  };

  const mockLoginUserDto: LoginUserDto = {
    email: 'john.doe.e2e@example.com',
    password: 'securePassword123',
  };

  const mockLoginResponseWithout2FA = {
    token: 'mock.jwt.token.e2e',
    user: {
      id: 'user-e2e-1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe.e2e@example.com',
      isTwoFactorEnabled: false,
      // ... other non-sensitive user fields
    },
  };

  const mockLoginResponseWith2FA = {
    email: 'john.doe.e2e@example.com',
    id: 'user-e2e-1',
    with2FA: true,
  };

  const mockVerifyUserDto: VerifyUserDto = {
    id: 'user-e2e-1',
    code: '123456',
  };

  const mockVerifyResponse = {
    token: 'mock.jwt.token.after.2fa.e2e',
    user: {
      id: 'user-e2e-1',
      email: 'john.doe.e2e@example.com',
      firstName: 'John',
      lastName: 'Doe',
      // ... other user fields
    },
  };

  const mockForgotPasswordEmail = 'john.doe.e2e@example.com';
  const mockForgotPasswordResponse = {
    message: 'Reset link sent if the email exists.',
    email: mockForgotPasswordEmail,
  };

  const mockResetPasswordDto: ResetPasswordDto = {
    token: 'mock-reset-token-e2e',
    password: 'newSecurePassword123',
  };

  const mockResetPasswordResponse = {
    id: 'user-e2e-1',
    email: 'john.doe.e2e@example.com',
    firstName: 'John',
    lastName: 'Doe',
    // ... other user fields, password is not returned
    updatedAt: new Date().toISOString(),
  };

  const mockFindAllPayload = { page: '1', limit: '10', query: { searchTerm: 'John' } }; // Query params are strings
  const mockFindAllResult = { data: [mockCreatedUser], count: 1 };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      // Import ClientsModule to create a client for sending test messages
      imports: [
        ClientsModule.register([
          {
            name: USER_SERVICE_CLIENT_NAME,
            transport: Transport.TCP, // Use the same transport as your service
            options: {
              host: 'localhost', // These won't be used as we mock the send method
              port: 4000, // Adjust port if needed for your service setup, or use default
            },
          },
        ]),
      ],
      // Provide the controller and its dependencies (usually just the service)
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            // Mock the methods the controller calls on the service
            getHello: jest.fn().mockReturnValue('Hello World!'),
            loginUser: jest.fn(), // Will be mocked per test case
            createUser: jest.fn().mockResolvedValue(mockCreatedUser),
            verifyUser: jest.fn(), // Will be mocked per test case
            requestPasswordReset: jest.fn(), // Will be mocked per test case
            resetPassword: jest.fn(), // Will be mocked per test case
            findAll: jest.fn().mockResolvedValue(mockFindAllResult),
            // Add mocks for other service methods if your controller uses them
          },
        },
      ],
    }).compile();

    // Get the client instance to send messages
    client = moduleFixture.get(USER_SERVICE_CLIENT_NAME);
    app = moduleFixture; // Keep reference if needed for teardown

    // --- IMPORTANT: Spy on the client's 'send' method ---
    // We mock the client to simulate sending messages and receiving responses.
    // This mock intercepts calls and returns predefined Observables based on the pattern.
    // Ensure the 'cmd' strings match exactly what's in your UserController's @MessagePattern.
    jest.spyOn(client, 'send').mockImplementation((pattern, payload) => {
      // console.log('Mock client.send called with:', pattern, payload); // For debugging
      if (pattern && typeof pattern === 'object' && 'cmd' in pattern) {
        switch (pattern.cmd) {
          // --- ADJUST THESE CASES TO MATCH YOUR ACTUAL UserController @MessagePattern VALUES ---
          case 'auth_get_hello': // Example: @MessagePattern({ cmd: 'auth_get_hello' }) for GET /
            return of('Hello World!');
          case 'auth_register': // Example: @MessagePattern({ cmd: 'auth_register' })
            return of(mockCreatedUser);
          case 'auth_login': // Example: @MessagePattern({ cmd: 'auth_login' })
            // Default mock, can be overridden in specific tests
            return of(mockLoginResponseWithout2FA);
          case 'auth_2fa': // Example: @MessagePattern({ cmd: 'auth_2fa' })
            return of(mockVerifyResponse);
          case 'auth-forgot': // Example: @MessagePattern({ cmd: 'auth-forgot' })
            return of(mockForgotPasswordResponse);
          case 'auth_reset': // Example: @MessagePattern({ cmd: 'auth_reset' })
            return of(mockResetPasswordResponse);
          case 'user_findAll': // Example: @MessagePattern({ cmd: 'user_findAll' })
            return of(mockFindAllResult);
          // Add cases for other patterns like delete if your controller has them
          default:
            // console.warn('Unhandled pattern in mock:', pattern);
            return of({ error: `Pattern '${pattern.cmd}' not mocked` });
        }
      }
      return of({ error: 'Invalid pattern format' });
    });

    // If your controller needs specific setup (e.g., for validation pipes globally),
    // you might need to get the INestApplication instance and call app.useGlobal... etc.
    // But typically for microservice controllers, this isn't needed for basic message handling tests.
    // const nestApp = moduleFixture.createNestApplication();
    // await nestApp.init(); // Not usually needed for microservice controller unit/mocked tests
  });

  afterEach(async () => {
    // Ensure the client connection is closed if it was somehow established
    if (client) {
      await client.close(); // Use close() for newer versions, disconnect() if needed for older
    }
    await app.close(); // Close the testing module
    jest.clearAllMocks();
  });

  // --- Test Cases for MessagePatterns ---
  // These tests simulate an external client sending messages to your User microservice.

  it('should call auth_get_hello and return "Hello World!"', async () => {
    // Simulate sending the 'auth_get_hello' command via the client
    // Adjust the pattern object to match the exact @MessagePattern in your controller for the GET / endpoint
    const resultObservable = client.send({ cmd: 'auth_get_hello' }, {}); // Likely no payload for getHello

    // Convert Observable to Promise to get the result
    const result = await firstValueFrom(resultObservable);

    // Assert the result
    expect(result).toEqual('Hello World!');

    // Assert that the client's send method was called correctly (verifies the mock setup)
    expect(client.send).toHaveBeenCalledWith(
      { cmd: 'auth_get_hello' },
      {}, // Likely no payload
    );
    // Implicitly, this also tests that UserService.getHello was called by the controller,
    // because our UserService mock defines that behavior.
  });

  it('should call auth_register and create a user', async () => {
    const resultObservable = client.send({ cmd: 'auth_register' }, mockRegisterUserDto);
    const result = await firstValueFrom(resultObservable);

    expect(result).toEqual(mockCreatedUser);
    expect(client.send).toHaveBeenCalledWith(
      { cmd: 'auth_register' },
      mockRegisterUserDto,
    );
  });

  it('should call auth_login and login a user (without 2FA)', async () => {
    // Override the mock for this specific test case
    (client.send as jest.Mock).mockImplementation((pattern, payload) => {
      if (pattern.cmd === 'auth_login') {
        return of(mockLoginResponseWithout2FA);
      }
      // Delegate to the original mock implementation for other patterns
      return of({ error: 'Pattern not handled in this test override' });
    });

    const resultObservable = client.send({ cmd: 'auth_login' }, mockLoginUserDto);
    const result = await firstValueFrom(resultObservable);

    expect(result).toEqual(mockLoginResponseWithout2FA);
    expect(client.send).toHaveBeenCalledWith(
      { cmd: 'auth_login' },
      mockLoginUserDto,
    );
  });

  it('should call auth_login and initiate 2FA login process', async () => {
    // Override the mock for this specific test case
    (client.send as jest.Mock).mockImplementation((pattern, payload) => {
      if (pattern.cmd === 'auth_login') {
        return of(mockLoginResponseWith2FA);
      }
      return of({ error: 'Pattern not handled in this test override' });
    });

    const resultObservable = client.send({ cmd: 'auth_login' }, mockLoginUserDto);
    const result = await firstValueFrom(resultObservable);

    expect(result).toEqual(mockLoginResponseWith2FA);
    expect(client.send).toHaveBeenCalledWith(
      { cmd: 'auth_login' },
      mockLoginUserDto,
    );
  });

  it('should call auth_2fa and verify a user', async () => {
    const resultObservable = client.send({ cmd: 'auth_2fa' }, mockVerifyUserDto);
    const result = await firstValueFrom(resultObservable);

    expect(result).toEqual(mockVerifyResponse);
    expect(client.send).toHaveBeenCalledWith(
      { cmd: 'auth_2fa' },
      mockVerifyUserDto,
    );
  });

  it('should call auth-forgot and request password reset', async () => {
    // Note: Based on your controller code, the payload for 'auth-forgot' is just the email string.
    const resultObservable = client.send({ cmd: 'auth-forgot' }, mockForgotPasswordEmail);
    const result = await firstValueFrom(resultObservable);

    expect(result).toEqual(mockForgotPasswordResponse);
    expect(client.send).toHaveBeenCalledWith(
      { cmd: 'auth-forgot' },
      mockForgotPasswordEmail, // Just the email string, not an object
    );
  });

  it('should call auth_reset and reset password', async () => {
    const resultObservable = client.send({ cmd: 'auth_reset' }, mockResetPasswordDto);
    const result = await firstValueFrom(resultObservable);

    expect(result).toEqual(mockResetPasswordResponse);
    expect(client.send).toHaveBeenCalledWith(
      { cmd: 'auth_reset' },
      mockResetPasswordDto,
    );
  });

  it('should call user_findAll and get users', async () => {
    const resultObservable = client.send({ cmd: 'user_findAll' }, mockFindAllPayload);
    const result = await firstValueFrom(resultObservable);

    expect(result).toEqual(mockFindAllResult);
    expect(client.send).toHaveBeenCalledWith(
      { cmd: 'user_findAll' },
      mockFindAllPayload,
    );
  });

  });
