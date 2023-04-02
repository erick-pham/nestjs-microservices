import { Module } from '@nestjs/common';
import { MsGatewayController } from './ms-gateway.controller';
import { MsGatewayService } from './ms-gateway.service';

@Module({
  imports: [],
  controllers: [MsGatewayController],
  providers: [MsGatewayService],
})
export class MsGatewayModule {}
