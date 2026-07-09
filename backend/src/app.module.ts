import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CurrencyModule } from './currency/currency.module';
import { SliderModule } from './slider/slider.module';
import { MinOrderModule } from './min-order/min-order.module';

import { User } from './users/user.entity';
import { Category } from './categories/category.entity';
import { Subcategory } from './categories/subcategory.entity';
import { Type } from './categories/type.entity';
import { Product } from './products/product.entity';
import { ProductParameter } from './products/product-parameter.entity';
import { SubcategoryParameter } from './categories/subcategory-parameter.entity';
import { Order, OrderItem } from './orders/order.entity';
import { Currency } from './currency/currency.entity';
import { MinOrder } from './min-order/min-order.entity';

@Module({
  imports: [
    // Глобальні змінні оточення
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        User,
        Category,
        Subcategory,
        Type,
        Product,
        ProductParameter,
        SubcategoryParameter,
        Order,
        OrderItem,
        Currency,
        MinOrder,
      ],
      synchronize: false,
      logging: ['error', 'warn'],
      migrationsRun: true,
      migrations: ['dist/migrations/*.js'],
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    }),

    // Модулі
    UsersModule,
    AuthModule,
    CategoriesModule,
    ProductsModule,
    OrdersModule,
    CurrencyModule,
    SliderModule,
    MinOrderModule,
  ],
})
export class AppModule {}