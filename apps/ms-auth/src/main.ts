import { NestFactory, Reflector } from '@nestjs/core';
import { Transport, KafkaOptions } from '@nestjs/microservices';
import { MsAuthModule } from './ms-auth.module';
import { ClassSerializerInterceptor } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(MsAuthModule);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  // microservice #1
  app.connectMicroservice<KafkaOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'auth', // auth-server
        brokers: ['rw.kfchs00fl92sqk9k8laq.at.double.cloud:9091'],
        ssl: true,
        sasl: {
          mechanism: 'plain', // scram-sha-256 or scram-sha-512
          username: 'admin',
          password: 'rEsvMUAqYQQtQZP7'
        }
      },
      consumer: {
        groupId: 'auth-consumer', // auth-consumer-server
        metadataMaxAge: 5000,
        allowAutoTopicCreation: true
      }
    }
  });
  await app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();
