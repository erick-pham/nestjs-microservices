import {
  IsString,
  IsArray,
  MinLength,
  MaxLength,
  IsOptional,
  IsISO8601
} from 'class-validator';
import { IApiKeyRevokeReq } from './apikey.interface';

export class RegisterApiKeyDto {
  @IsString()
  accessToken: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  scopes?: string[];

  @IsString()
  @MinLength(6)
  @MaxLength(256)
  apiName: string;

  @IsISO8601({ strict: true })
  expiredAt: Date;
}

export class RevokeApiKeyDto implements IApiKeyRevokeReq {
  @IsString()
  apiKey: string;
}
