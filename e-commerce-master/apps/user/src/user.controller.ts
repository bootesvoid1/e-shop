import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RegisterUserDto } from '@app/shared/dtos/user/register_user.dto';
import { LoginUserDto } from '@app/shared/dtos/user/user.dto';
import { VerifyUserDto } from '@app/shared/dtos/user/verify_user.dto';
import { ResetPasswordDto } from '@app/shared/dtos/user/reset_password.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getHello(): string {
    return this.userService.getHello();
  }

  @MessagePattern({ cmd: 'auth_login' })
  getUserByEmail(@Payload() loginUserDto: LoginUserDto) {
    return this.userService.loginUser(loginUserDto);
  }
  @MessagePattern({ cmd: 'auth_register' })
  async createUser(@Payload() registerUserDto: RegisterUserDto) {
    const user = await this.userService.createUser(registerUserDto);
    return user;
  }
  @MessagePattern({ cmd: 'auth_2fa' })
  async verifyUser(@Payload() verifyUserDto: VerifyUserDto) {
    const user = await this.userService.verifyUser(verifyUserDto);
    return user;
  }
  @MessagePattern({ cmd: 'auth-forgot' })
  async requestPassword(@Payload() email: string) {
    const user = await this.userService.requestPasswordReset(email);
    return user;
  }
  @MessagePattern({ cmd: 'auth_reset' })
  async resetPassword(@Payload() payload: ResetPasswordDto) {
    const user = await this.userService.resetPassword(payload);
    return user;
  }

  @MessagePattern({ cmd: 'user_findAll' })
  async findAll(
    @Payload() payload: { page: number; limit: number; query: any },
  ) {
    return await this.userService.findAll(payload);
  }
}
