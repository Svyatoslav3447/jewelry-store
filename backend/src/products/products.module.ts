import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './product.entity';
import { Category } from '../categories/category.entity';
import { Subcategory } from '../categories/subcategory.entity';
import { Type } from '../categories/type.entity';
import { CurrencyModule } from '../currency/currency.module';
import { AuthModule } from '../auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SubcategoryParameter } from '../categories/subcategory-parameter.entity';
import { ProductParameter } from './product-parameter.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, Subcategory, Type, SubcategoryParameter, ProductParameter,]),
    CurrencyModule, AuthModule,
    EventEmitterModule.forRoot(),
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}