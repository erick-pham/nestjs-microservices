import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { Response as ResponseExpress } from 'express';
import {
  APIKEY_PATTERN,
  IApiKeyResponse,
  IApiKeyRevokeRes
} from 'apps/ms-auth/src/apikey/apikey.interface';
import { RequestApiKeyDto, RevokeApiKeyDto } from './apikey.dto';
import { ApiTags } from '@nestjs/swagger';
import { MS_AUTH_SERVICE_NAME } from '@app/ms-common/interface/auth.interface';

@ApiTags('Authentication-ApiKey')
@Controller('apikey')
export class ApiKeyController {
  constructor(@Inject(MS_AUTH_SERVICE_NAME) private client: ClientProxy) {}

  @Post('generate')
  async generate(
    @Body() body: RequestApiKeyDto,
    @Res() response: ResponseExpress
  ): Promise<ResponseExpress> {
    const rs = await lastValueFrom(
      this.client.send<IApiKeyResponse>(APIKEY_PATTERN.Generate, body)
    );

    return response.status(rs.status).json(rs);
  }

  // @ApiResponse({
  //   status: 204,
  //   description: 'Successful response',
  //   type: LoginResponseDto
  // })
  @Post('revoke')
  async revoke(
    @Body() body: RevokeApiKeyDto,
    @Res() response: ResponseExpress
  ): Promise<ResponseExpress> {
    const rs = await lastValueFrom(
      this.client.send<IApiKeyRevokeRes>(APIKEY_PATTERN.Revoke, body)
    );

    return response.status(rs.status).json(rs);
  }
}
