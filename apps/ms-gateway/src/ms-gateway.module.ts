import { Module } from '@nestjs/common';
import { MsGatewayController } from './ms-gateway.controller';
import { MsGatewayService } from './ms-gateway.service';
import { AuthModule } from './svc-auth/auth.module';
import { MS_AUTH_SERVICE_NAME } from './common/constants';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule],
  controllers: [MsGatewayController],
  providers: [
    MsGatewayService,
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
  ]
})
export class MsGatewayModule {}
