import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './JwtAuth.guard';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET, // DO NOT remove this here
    }),
    PassportModule,
  ],
  providers: [JwtStrategy, JwtAuthGuard],
  exports: [JwtModule, JwtStrategy],
})
export class SharedAuthModule {}
