import { Subcategory } from './subcategory.entity';
export declare class Category {
    id: number;
    name: string;
    created_at: Date;
    subcategories: Subcategory[];
}
