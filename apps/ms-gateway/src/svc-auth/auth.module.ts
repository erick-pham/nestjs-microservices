import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { ConfigModule } from '@nestjs/config';
import { ApiKeyController } from './apikey/apikey.controller';
@Module({
  imports: [ConfigModule.forRoot()],
  providers: [],
  controllers: [AuthController, ApiKeyController]
})
export class AuthModule {}
