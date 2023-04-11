import { NestFactory, Reflector } from '@nestjs/core';
import { Transport, TcpOptions } from '@nestjs/microservices';
import { MsAuthModule } from './ms-auth.module';
import { ClassSerializerInterceptor } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(MsAuthModule);

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // microservice #1
  app.connectMicroservice<TcpOptions>({
    transport: Transport.TCP,
    options: {
      host: String(process.env.MS_AUTH_HOST),
      port: Number(process.env.MS_AUTH_PORT)
    }
  });
  await app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();
