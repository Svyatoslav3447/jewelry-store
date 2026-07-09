import { Test, TestingModule } from '@nestjs/testing';
import { MinOrderService } from './min-order.service';

describe('MinOrderService', () => {
  let service: MinOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MinOrderService],
    }).compile();

    service = module.get<MinOrderService>(MinOrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
