import { Controller, Get } from '@nestjs/common';
import { MsGatewayService } from './ms-gateway.service';

@Controller()
export class MsGatewayController {
  constructor(private readonly msGatewayService: MsGatewayService) {}

  @Get()
  getHello(): string {
    return this.msGatewayService.getHello();
  }
}
