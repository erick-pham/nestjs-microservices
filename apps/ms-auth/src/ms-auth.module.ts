import { Module } from '@nestjs/common';
import { MsAuthController } from './ms-auth.controller';
import { MsAuthService } from './ms-auth.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthEntity } from './auth/auth.entity';
import { ConfigModule } from '@nestjs/config';
import { ApiKeyModule } from './apikey/apikey.module';
import ApiKeyEntity from './apikey/apikey.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.auth.sqlite',
      logging: true,
      entities: [AuthEntity, ApiKeyEntity],
      synchronize: true // never true in production!
    }),
    AuthModule,
    ApiKeyModule
  ],
  controllers: [MsAuthController],
  providers: [MsAuthService]
})
export class MsAuthModule {}
