import { Test, TestingModule } from '@nestjs/testing';
import { MinOrderController } from './min-order.controller';

describe('MinOrderController', () => {
  let controller: MinOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MinOrderController],
    }).compile();

    controller = module.get<MinOrderController>(MinOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
