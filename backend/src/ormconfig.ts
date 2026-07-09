import { DataSource } from 'typeorm';
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

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'postgres',
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
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
  logging: ['error', 'warn'],
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});