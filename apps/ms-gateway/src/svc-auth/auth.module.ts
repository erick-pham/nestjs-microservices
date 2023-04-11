import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MS_AUTH_SERVICE_NAME } from '../common/constants';
import { ApiKeyController } from './apikey/apikey.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [
    {
      provide: MS_AUTH_SERVICE_NAME,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get('MS_AUTH_HOST'),
            port: configService.get('MS_AUTH_PORT')
          }
        });
      }
    }
  ],
  controllers: [AuthController, ApiKeyController]
})
export class AuthModule {}
