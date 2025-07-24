import { RegisterUserDto } from '@app/shared/dtos/user/register_user.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, MoreThan, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '@app/shared/dtos/user/user.dto';
import { MailService } from './mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { VerifyUserDto } from '@app/shared/dtos/user/verify_user.dto';
import { RpcException } from '@nestjs/microservices';
import { randomBytes } from 'crypto';
import { UsersEntity } from '@app/shared/common/databases/entities/user.entity';

@Injectable()
export class UserService {
  getHello(): string {
    return 'Hello World!';
  }

  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(registerUserDto: RegisterUserDto): Promise<UsersEntity> {
    const { password, ...rest } = registerUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      ...rest,
      password: hashedPassword,
    });
    const savedUser = this.userRepository.save(user);
    return savedUser;
  }
  async loginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.isTwoFactorEnabled) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
      user.twoFactorCode = code;
      user.twoFactorCodeExpiresAt = expiresAt;
      await this.userRepository.save(user);
      await this.mailService.send2FACode(user, code);
      return { email: user.email, id: user.id, with2FA: true };
    }
    const token = this.jwtService.sign(
      { sub: user.id, email: user.email },
      { expiresIn: '24h', secret: 'secret' }, // ✅ CORRECT property name is `secret`, NOT `secretOrKey`
    );

    const { password: _, ...rest } = user;
    return { token, user: rest };
  }

  async verifyUser(verifyUser: VerifyUserDto) {
    const { id, code } = verifyUser;
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user || !user.twoFactorCode || !user.twoFactorCodeExpiresAt) {
      throw new UnauthorizedException('2FA not initialized');
    }

    if (
      user.twoFactorCode !== code ||
      new Date() > user.twoFactorCodeExpiresAt
    ) {
      throw new RpcException('Invalid or expired 2FA code');
    }
    user.twoFactorCode = '';
    user.twoFactorCodeExpiresAt = null;
    await this.userRepository.save(user);
    const token = this.jwtService.sign({ sub: user.id, email: user.email });

    return { token, user };
  }
  async requestPasswordReset(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) return;

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    user.passwordResetToken = token;
    user.passwordResetTokenExpiresAt = expiresAt;
    await this.userRepository.save(user);

    await this.mailService.sendResetLink(user.email, token);
    return {
      message: 'Reset link sent if the email exists.',
      email: user.email,
    };
  }
  async resetPassword(payload: { token: string; password: string }) {
    const { token, password } = payload;
    const user = await this.userRepository.findOne({
      where: {
        passwordResetToken: token,
        passwordResetTokenExpiresAt: MoreThan(new Date()),
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    user.password = await bcrypt.hash(password, 10);
    user.passwordResetToken = '';
    user.passwordResetTokenExpiresAt = null;

    return this.userRepository.save(user);
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({
      where: { id: id.toString() },
    });
  }

  async findAll(payload: { page: number; limit: number; query: any }) {
    const { page, limit, query } = payload;
    const where = await this.formatFilter(query);
    const [data, count] = await this.userRepository.findAndCount({
      where,
      take: limit,

      skip: (page - 1) * limit,
      // order: { createdAt: sort },
    });
    return { data, count };
  }

  private formatFilter(query: any): FindOptionsWhere<UsersEntity> {
    const where: FindOptionsWhere<UsersEntity> = {};
    where.deleted = false;

    where.role = 'user';

    // Process `label` if present
    if (query.searchTerm && query.searchTerm !== '') {
      // Case-insensitive exact match for `label`
      where.firstName = ILike(`%${query.searchTerm}%`);
    }

    return where;
  }
}
