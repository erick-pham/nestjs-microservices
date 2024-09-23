import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { MS_AUTH_SERVICE_NAME } from './common/constants';
import { ClientKafka } from '@nestjs/microservices';
import { map } from 'rxjs/operators';

@Injectable()
export class MsGatewayService implements OnModuleInit {
  constructor(
    @Inject(MS_AUTH_SERVICE_NAME) private readonly authClient: ClientKafka
  ) {}

  async onModuleInit() {
    this.authClient.subscribeToResponseOf('ping');
    await this.authClient.connect();
  }

  async pingMSAuth() {
    const startTs = Date.now();
    const pattern = { cmd: 'ping' };
    const payload = {};

    return this.authClient
      .send<string>(pattern.cmd, payload)
      .pipe(
        map((message: string) => ({ message, duration: Date.now() - startTs }))
      );
  }

  getHello(): string {
    return 'Hello World!';
  }
}
