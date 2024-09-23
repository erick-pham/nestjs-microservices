import { Global, Module } from '@nestjs/common';
import { MsGatewayController } from './ms-gateway.controller';
import { MsGatewayService } from './ms-gateway.service';
import { AuthModule } from './svc-auth/auth.module';
import { MS_AUTH_SERVICE_NAME } from './common/constants';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';

@Global()
@Module({
  imports: [ConfigModule.forRoot(), AuthModule],
  controllers: [MsGatewayController],
  providers: [
    MsGatewayService,
    {
      provide: MS_AUTH_SERVICE_NAME,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new ClientKafka({
          client: {
            clientId: 'auth', // auth-client
            brokers: ['rw.kfchs00fl92sqk9k8laq.at.double.cloud:9091'],
            ssl: true,
            sasl: {
              mechanism: 'plain', // scram-sha-256 or scram-sha-512
              username: 'admin',
              password: 'rEsvMUAqYQQtQZP7'
            }
          },
          consumer: {
            groupId: 'auth-consumer', // auth-consumer-client
            metadataMaxAge: 3000,
            allowAutoTopicCreation: true
          }
        });
      }
    }
  ],
  exports: [MS_AUTH_SERVICE_NAME]
})
export class MsGatewayModule {}
