import { Module } from '@nestjs/common';
import { ApiKeyController } from './apikey.controller';
import { ApiKeyService } from './apikey.service';
import { ApiKeyEntity } from './apikey.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKeyRepository } from './apikey.repository';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../common/constants';
import { AuthModule } from '../auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
@Module({
  imports: [
    AuthModule,
    JwtModule.register(jwtConstants),
    CacheModule.register(),
    TypeOrmModule.forFeature([ApiKeyEntity])
  ],
  controllers: [ApiKeyController],
  providers: [ApiKeyService, ApiKeyRepository]
})
export class ApiKeyModule {}
