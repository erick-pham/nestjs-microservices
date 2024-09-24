import { ApiKeyService } from './apikey.service';
import { MessagePattern } from '@nestjs/microservices';
import {
  APIKEY_PATTERN,
  IApiKeyRequest,
  IApiKeyRevokeReq
} from './apikey.interface';
import { Controller } from '@nestjs/common';

@Controller('ApiKey')
export class ApiKeyController {
  constructor(private readonly apikeyService: ApiKeyService) {}

  @MessagePattern(APIKEY_PATTERN.Generate.cmd)
  async generateApiKeyAndSecret(payload: IApiKeyRequest) {
    return this.apikeyService.generateKeyAndSecret(payload);
  }

  @MessagePattern(APIKEY_PATTERN.Revoke.cmd)
  async revoke(payload: IApiKeyRevokeReq) {
    return this.apikeyService.revoke(payload.apiKey);
  }
}
