import { Product } from './product.entity';
import { SubcategoryParameter } from '../categories/subcategory-parameter.entity';
export declare class ProductParameter {
    id: number;
    product: Product;
    parameter: SubcategoryParameter;
    value: string;
}
