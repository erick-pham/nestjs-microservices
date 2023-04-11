import {
  MaxLength,
  IsNotEmpty,
  MinLength,
  IsString,
  IsArray,
  IsOptional,
  IsISO8601
} from 'class-validator';
import {
  IApiKeyRequest,
  IApiKeyRevokeReq
} from 'apps/ms-auth/src/apikey/apikey.interface';
import { ApiProperty } from '@nestjs/swagger';

export class RequestApiKeyDto implements IApiKeyRequest {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    default: 'eyJhbGciO...',
    description: 'Your access token from api login'
  })
  public readonly accessToken: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ApiProperty({
    type: Array,
    format: 'string',
    default: [],
    examples: ['bs.AB', 'bs.AC'],
    required: false
  })
  scopes?: string[];

  @IsString()
  @MinLength(6)
  @MaxLength(256)
  @ApiProperty({
    type: String,
    default: 'Api key name',
    description: 'Name',
    minLength: 6,
    maxLength: 255
  })
  apiName: string;

  @IsOptional()
  @IsISO8601({ strict: true })
  @ApiProperty({
    type: Date,
    default: null,
    description: 'Api key expired date. 2023-03-25T02:13:11.119Z'
  })
  expiredAt: null | Date;
}

export class RevokeApiKeyDto implements IApiKeyRevokeReq {
  @IsString()
  @ApiProperty({
    type: String,
    default: '7d079d61710a3f71855a2f93c422e95e'
  })
  apiKey: string;
}
