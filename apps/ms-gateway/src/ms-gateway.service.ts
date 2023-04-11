import { Inject, Injectable } from '@nestjs/common';
import { MS_AUTH_SERVICE_NAME } from './common/constants';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs/operators';
@Injectable()
export class MsGatewayService {
  constructor(
    @Inject(MS_AUTH_SERVICE_NAME) private readonly clientMSAuth: ClientProxy
  ) {}

  pingMSAuth() {
    const startTs = Date.now();
    const pattern = { cmd: 'ping' };
    const payload = {};
    return this.clientMSAuth
      .send<string>(pattern, payload)
      .pipe(
        map((message: string) => ({ message, duration: Date.now() - startTs }))
      );
  }

  getHello(): string {
    return 'Hello World!';
  }
}
