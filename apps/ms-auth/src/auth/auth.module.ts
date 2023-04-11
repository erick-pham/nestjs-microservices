import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthEntity } from './auth.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConstants } from '../common/constants';
import { AuthRepository } from './auth.repository';

@Module({
  imports: [
    JwtModule.register(jwtConstants),
    TypeOrmModule.forFeature([AuthEntity])
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository],
  exports: [AuthService]
})
export class AuthModule {}
