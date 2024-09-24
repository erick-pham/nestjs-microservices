import { NestFactory, Reflector } from '@nestjs/core';
import { Transport, KafkaOptions } from '@nestjs/microservices';
import { MsAuthModule } from './ms-auth.module';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { getKafkaConfig } from '@app/ms-common/kafka';

async function bootstrap() {
  const app = await NestFactory.create(MsAuthModule);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  // microservice #1
  app.connectMicroservice<KafkaOptions>({
    transport: Transport.KAFKA,
    options: {
      ...getKafkaConfig(),
      client: {
        ...getKafkaConfig().client,
        clientId: 'auth-server'
      }
    }
  });
  await app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();
