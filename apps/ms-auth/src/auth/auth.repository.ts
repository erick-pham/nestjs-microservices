import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from '@app/ms-common/base-repository';
import AuthEntity from './auth.entity';

@Injectable()
export class AuthRepository extends BaseRepository<AuthEntity> {
  constructor(
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>
  ) {
    super(authRepository);
  }
}
