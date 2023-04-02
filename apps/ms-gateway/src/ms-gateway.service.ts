import { Injectable } from '@nestjs/common';

@Injectable()
export class MsGatewayService {
  getHello(): string {
    return 'Hello World!';
  }
}
