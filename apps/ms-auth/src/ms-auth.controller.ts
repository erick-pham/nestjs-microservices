import { Controller, Get } from '@nestjs/common';
import { MsAuthService } from './ms-auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Controller()
export class MsAuthController {
  constructor(private readonly msAuthService: MsAuthService) {}

  @Get()
  getHello(): string {
    return this.msAuthService.getHello();
  }

  @MessagePattern({ cmd: 'ping' })
  ping() {
    return of('pong').pipe(delay(200));
  }
}
