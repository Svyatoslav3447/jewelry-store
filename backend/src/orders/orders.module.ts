import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order, OrderItem } from './order.entity';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';
import { AuthModule } from '../auth/auth.module';
import { MinOrderModule } from '../min-order/min-order.module';
import { CurrencyModule } from '../currency/currency.module';
import { SubcategoryParameter } from '../categories/subcategory-parameter.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Product, User, SubcategoryParameter]), MinOrderModule, CurrencyModule, AuthModule],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}