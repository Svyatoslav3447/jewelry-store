import { Category } from './category.entity';
import { Type } from './type.entity';
import { SubcategoryParameter } from './subcategory-parameter.entity';
export declare class Subcategory {
    id: number;
    name: string;
    category: Category;
    created_at: Date;
    types: Type[];
    parameters: SubcategoryParameter[];
}
