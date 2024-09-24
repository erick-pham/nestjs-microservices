import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { MyClientKafka } from '@app/ms-common/kafka';
import { MS_AUTH_SERVICE_NAME } from '@app/ms-common/interface/auth.interface';

@Injectable()
export class MsGatewayService {
  constructor(
    @Inject(MS_AUTH_SERVICE_NAME) private readonly authClient: MyClientKafka
  ) {}

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
