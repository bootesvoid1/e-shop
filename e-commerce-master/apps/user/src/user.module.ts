// apps/user/src/user.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MailModule } from './mail/mail.module';
import { MailService } from './mail/mail.service';
import { userDBdataSourceOptions } from '@app/shared/common/databases/user_db.config';
import { UsersEntity } from '@app/shared/common/databases/entities/user.entity';
import { SharedAuthModule } from '@app/auth/auth.module';

@Module({
  imports: [
    SharedAuthModule,
    MailModule,
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 3002, // user microservice port
        },
      },
    ]),
    TypeOrmModule.forRoot(userDBdataSourceOptions),
    TypeOrmModule.forFeature([UsersEntity]),
  ],
  providers: [UserService, MailService],
  controllers: [UserController],
})
export class UserModule {}
