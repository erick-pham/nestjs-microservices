import { CACHE_MANAGER, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import {
  generateKey,
  generateSecretHash,
  compareKeys
} from '@app/utils/crypto';
import { ApiKeyRepository } from './apikey.repository';
import { Errors } from 'apps/ms-auth/src/common';
import ApiKeyEntity from './apikey.entity';
import { AuthService } from '../auth/auth.service';
import MessagePatternResponse from '@app/ms-common/response/message-pattern-response';
import {
  IApiKeyRequest,
  IApiKeyResponse,
  IApiKeyRevokeRes
} from './apikey.interface';

@Injectable()
export class ApiKeyService {
  constructor(
    private apikeyRepository: ApiKeyRepository,
    private authService: AuthService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  public async verifyApiKey(apiKey: string): Promise<ApiKeyEntity | null> {
    let dbApiKey = await this.cacheManager.get<ApiKeyEntity | null>(apiKey);

    if (!dbApiKey) {
      dbApiKey = await this.apikeyRepository.findOneBy({
        apiKey: apiKey,
        isRevoked: false
      });

      await this.cacheManager.set(apiKey, dbApiKey, 1 * 60 * 60 * 1000);
    }

    if (!dbApiKey) {
      return null;
    }

    if (dbApiKey.expiredAt && dbApiKey.expiredAt < new Date()) {
      return null;
    }

    if (!compareKeys(dbApiKey.apiSecret, apiKey)) {
      return null;
    }

    return dbApiKey;
  }

  public async generateKeyAndSecret(registrationData: IApiKeyRequest) {
    const verifiedUser = await this.authService.validate({
      accessToken: registrationData.accessToken
    });

    if (!verifiedUser.userId) {
      return verifiedUser;
    }
    const apiKey: string = generateKey();
    const apiSecretHashed: string = generateSecretHash(apiKey);
    const dbCreated = this.apikeyRepository.create({
      userId: verifiedUser.userId,
      apiKey: apiKey,
      apiSecret: apiSecretHashed,
      apiName: registrationData.apiName,
      scopes: registrationData.scopes,
      expiredAt: registrationData.expiredAt
    });
    await this.apikeyRepository.save(dbCreated);
    delete dbCreated.apiSecret;
    return new MessagePatternResponse()
      .setStatus(HttpStatus.OK)
      .send<IApiKeyResponse>(dbCreated);
  }

  public async revoke(apiKey: string) {
    const verifiedKey = await this.verifyApiKey(apiKey);
    if (!verifiedKey) {
      return new MessagePatternResponse()
        .setStatus(HttpStatus.UNAUTHORIZED)
        .send<IApiKeyRevokeRes>([Errors.APIKEY_INVALID]);
    }
    await this.apikeyRepository.update({ apiKey }, { isRevoked: true });
    return new MessagePatternResponse()
      .setStatus(HttpStatus.ACCEPTED)
      .send<IApiKeyRevokeRes>(null);
  }
}
