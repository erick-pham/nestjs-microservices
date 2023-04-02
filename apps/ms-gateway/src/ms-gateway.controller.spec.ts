import { Test, TestingModule } from '@nestjs/testing';
import { MsGatewayController } from './ms-gateway.controller';
import { MsGatewayService } from './ms-gateway.service';

describe('MsGatewayController', () => {
  let msGatewayController: MsGatewayController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MsGatewayController],
      providers: [MsGatewayService],
    }).compile();

    msGatewayController = app.get<MsGatewayController>(MsGatewayController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(msGatewayController.getHello()).toBe('Hello World!');
    });
  });
});
