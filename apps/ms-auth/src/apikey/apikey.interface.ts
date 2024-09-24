import { IBaseResponse } from '@app/ms-common/response/message-pattern-response';

export const APIKEY_PATTERN = {
  Generate: { cmd: 'generate' },
  Revoke: { cmd: 'revoke' }
};

export interface IApiKeyRequest {
  accessToken: string;
  apiName: string;
  expiredAt?: string | Date;
  scopes?: string[];
}

export interface IApiKeyResponse extends IBaseResponse {
  data: {
    id: number;
    userId: number;
    apiKey: string;
    apiName: string;
    isRevoked: boolean;
    scopes: string[];
    createdAt: string | Date;
    updatedAt: string | Date;
    deletedAt: string | Date;
    expiredAt: string | Date;
  };
}

export interface IApiKeyRevokeReq {
  apiKey: string;
}

export type IApiKeyRevokeRes = IBaseResponse;
