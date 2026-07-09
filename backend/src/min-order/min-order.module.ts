import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinOrder } from './min-order.entity';
import { MinOrderService } from './min-order.service';
import { MinOrderController } from './min-order.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([MinOrder]), AuthModule],
  providers: [MinOrderService],
  controllers: [MinOrderController],
  exports: [MinOrderService],
})
export class MinOrderModule {}