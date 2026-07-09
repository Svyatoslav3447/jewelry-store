import { Category } from '../categories/category.entity';
import { Subcategory } from '../categories/subcategory.entity';
import { Type } from '../categories/type.entity';
import { OrderItem } from '../orders/order.entity';
import { ProductParameter } from './product-parameter.entity';
export declare class Product {
    id: number;
    sku: string;
    price_usd: number;
    category: Category;
    subcategory: Subcategory | null;
    type: Type | null;
    created_at: Date;
    orderItems: OrderItem[];
    parameters: ProductParameter[];
    is_hidden: boolean;
}
