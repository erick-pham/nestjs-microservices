import { Controller, Get } from '@nestjs/common';
import { MsGatewayService } from './ms-gateway.service';
import { zip } from 'rxjs';
import { map } from 'rxjs/operators';

@Controller()
export class MsGatewayController {
  constructor(private readonly msGatewayService: MsGatewayService) {}

  @Get()
  getHello(): string {
    return this.msGatewayService.getHello();
  }

  @Get('/ping-all')
  pingAll() {
    return this.msGatewayService.pingMSAuth();
    return zip(this.msGatewayService.pingMSAuth()).pipe(
      map(([pongMSAuth]) => ({
        pongMSAuth
      }))
    );
  }
}
