import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private categoriesService;
    constructor(categoriesService: CategoriesService);
    getAll(): Promise<import("./category.entity").Category[]>;
    createCategory(name: string): Promise<import("./category.entity").Category>;
    updateCategory(id: string, name: string): Promise<import("./category.entity").Category>;
    deleteCategory(id: string): Promise<import("typeorm").DeleteResult>;
    createSubcategory(body: {
        name: string;
        categoryId: number;
    }): Promise<import("./subcategory.entity").Subcategory>;
    updateSubcategory(id: string, name: string): Promise<import("typeorm").UpdateResult>;
    deleteSubcategory(id: string): Promise<import("typeorm").DeleteResult>;
    createType(body: {
        name: string;
        subcategoryId: number;
    }): Promise<import("./type.entity").Type>;
    updateType(id: string, name: string): Promise<import("typeorm").UpdateResult>;
    deleteType(id: string): Promise<import("typeorm").DeleteResult>;
    updateCategoryImage(id: string, file: Express.Multer.File): Promise<{
        message: string;
        image: string;
    }>;
    createParam(body: {
        subcategoryId: number;
        name: string;
        required?: boolean;
    }): Promise<import("./subcategory-parameter.entity").SubcategoryParameter>;
    updateParam(id: string, body: {
        name: string;
        required?: boolean;
    }): Promise<import("./subcategory-parameter.entity").SubcategoryParameter>;
    deleteParam(id: string): Promise<import("typeorm").DeleteResult>;
}
