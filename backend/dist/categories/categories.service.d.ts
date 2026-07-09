import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { Subcategory } from './subcategory.entity';
import { Type } from './type.entity';
import { SubcategoryParameter } from '../categories/subcategory-parameter.entity';
export declare class CategoriesService {
    private categoryRepo;
    private subcategoryRepo;
    private typeRepo;
    private subParamRepo;
    constructor(categoryRepo: Repository<Category>, subcategoryRepo: Repository<Subcategory>, typeRepo: Repository<Type>, subParamRepo: Repository<SubcategoryParameter>);
    findAll(): Promise<Category[]>;
    createCategory(name: string): Promise<Category>;
    updateCategory(id: number, name: string): Promise<Category>;
    deleteCategory(id: number): Promise<import("typeorm").DeleteResult>;
    createSubcategory(name: string, categoryId: number): Promise<Subcategory>;
    updateSubcategory(id: number, name: string): Promise<import("typeorm").UpdateResult>;
    deleteSubcategory(id: number): Promise<import("typeorm").DeleteResult>;
    createType(name: string, subcategoryId: number): Promise<Type>;
    updateType(id: number, name: string): Promise<import("typeorm").UpdateResult>;
    deleteType(id: number): Promise<import("typeorm").DeleteResult>;
    findById(id: number): Promise<Category | null>;
    createSubcategoryParameter(subcategoryId: number, name: string, required?: boolean): Promise<SubcategoryParameter>;
    updateSubcategoryParameter(id: number, name: string, required?: boolean): Promise<SubcategoryParameter>;
    deleteSubcategoryParameter(id: number): Promise<import("typeorm").DeleteResult>;
}
