import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MsGatewayController } from './ms-gateway.controller';
import { MsGatewayService } from './ms-gateway.service';
import { AuthModule } from './svc-auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { getKafkaConfig, MyClientKafka } from '@app/ms-common/kafka';
import { ClsModule, ClsService } from 'nestjs-cls';
import { LoggerMiddleware } from './middleware/logger.middleware';
import {
  MS_AUTH_SERVICE_NAME,
  MS_AUTH_MESSAGE_PATTERN
} from '@app/ms-common/interface/auth.interface';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    ClsModule.forRoot({
      middleware: {
        // automatically mount the
        // ClsMiddleware for all routes
        mount: true,
        // and use the setup method to
        // provide default store values.
        setup: (cls, req) => {
          cls.set('requestId', req.headers['Request-Id']);
        }
      }
    }),
    AuthModule
  ],
  controllers: [MsGatewayController],
  providers: [
    {
      provide: MS_AUTH_SERVICE_NAME,
      inject: [ClsService],
      useFactory: (cls: ClsService) => {
        return new MyClientKafka({
          options: getKafkaConfig(),
          clsService: cls,
          subscribeToResponseOfPatterns: Object.values(MS_AUTH_MESSAGE_PATTERN)
        });
      }
    },
    MsGatewayService
  ],
  exports: [MS_AUTH_SERVICE_NAME]
})
export class MsGatewayModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
