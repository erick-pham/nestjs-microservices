import { Test, TestingModule } from '@nestjs/testing';
import { MsCommonService } from './ms-common.service';

describe('MsCommonService', () => {
  let service: MsCommonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MsCommonService],
    }).compile();

    service = module.get<MsCommonService>(MsCommonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
