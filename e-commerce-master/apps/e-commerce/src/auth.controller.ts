import { RegisterUserDto } from '@app/shared/dtos/user/register_user.dto';
import { ResetPasswordDto } from '@app/shared/dtos/user/reset_password.dto';
import { LoginUserDto } from '@app/shared/dtos/user/user.dto';
import { VerifyUserDto } from '@app/shared/dtos/user/verify_user.dto';
import {
  Body,
  Controller,
  Inject,
  InternalServerErrorException,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
    @Inject('TRANSACTION_SERVICE') private readonly cartClient: ClientProxy,
  ) {}
  @Post('sign-in')
  async signUn(
    @Body() credentials: LoginUserDto,
  ): Promise<{ access_token: string }> {
    return await lastValueFrom(
      this.userClient.send({ cmd: 'auth_login' }, credentials),
    );
  }
  @Post('sign-up') // (you wrote sign-out, but I assume this is registration)
  async signIn(
    @Body() createUserDto: RegisterUserDto,
  ): Promise<{ message: string }> {
    // 1. Call user microservice to register the user
    const result = await lastValueFrom(
      this.userClient.send({ cmd: 'auth_register' }, createUserDto),
    );

    // result should include the newly created user's ID
    const userId = result?.id;
    if (!userId) {
      throw new InternalServerErrorException('User ID not returned');
    }

    // 2. Create an empty cart for the new user
    await lastValueFrom(
      this.cartClient.send({ cmd: 'cart_create' }, { userId, items: [] }),
    );

    // 3. Return final response
    return { message: 'User registered and cart created successfully' };
  }

  @Post('two-fa')
  async twoFa(
    @Body() verifyUserDto: VerifyUserDto,
  ): Promise<{ message: string }> {
    return await lastValueFrom(
      this.userClient.send({ cmd: 'auth_2fa' }, verifyUserDto),
    );
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() payload: { email: string },
  ): Promise<{ message: string; email: string }> {
    return await lastValueFrom(
      this.userClient.send({ cmd: 'auth-forgot' }, payload.email),
    );
  }

  @Post('reset-password')
  async resetPassword(@Body() payload: ResetPasswordDto) {
    return await lastValueFrom(
      this.userClient.send({ cmd: 'auth_reset' }, payload),
    );
  }
  @Post('all')
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
    @Body() query: any,
  ) {
    return lastValueFrom(
      this.userClient.send({ cmd: 'user_findAll' }, { page, limit, query }),
    );
  }
}
