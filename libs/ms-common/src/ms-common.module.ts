import { Module } from '@nestjs/common';
import { MsCommonService } from './ms-common.service';

@Module({
  providers: [MsCommonService],
  exports: [MsCommonService],
})
export class MsCommonModule {}
