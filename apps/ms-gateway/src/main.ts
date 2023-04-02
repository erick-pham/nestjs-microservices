import { NestFactory } from '@nestjs/core';
import { MsGatewayModule } from './ms-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(MsGatewayModule);
  await app.listen(3000);
}
bootstrap();
