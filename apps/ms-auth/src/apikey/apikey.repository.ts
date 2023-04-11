import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from '@app/ms-common/base-repository';
import ApiKeyEntity from './apikey.entity';

@Injectable()
export class ApiKeyRepository extends BaseRepository<ApiKeyEntity> {
  constructor(
    @InjectRepository(ApiKeyEntity)
    private readonly apikeyRepository: Repository<ApiKeyEntity>
  ) {
    super(apikeyRepository);
  }
}
