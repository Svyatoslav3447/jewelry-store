import { ProductsService } from './products.service';
import express from 'express';
export declare class ProductsController {
    private productsService;
    constructor(productsService: ProductsService);
    updateStock(id: string, quantity: number): Promise<import("./product.entity").Product>;
    getPopular(): Promise<{
        id: number;
        sku: string;
        price_usd: number;
        price_grn: number;
        category: import("../categories/category.entity").Category;
        subcategory: import("../categories/subcategory.entity").Subcategory | null;
        type: import("../categories/type.entity").Type | null;
        is_hidden: boolean;
        created_at: Date;
        totalSold: number;
        parameters: any[];
    }[]>;
    getAll(req: any, page: string, limit: string, categoryId?: string, subcategoryId?: string, typeId?: string, search?: string, sort?: string): Promise<{
        data: {
            id: number;
            sku: string;
            price_usd: number;
            price_grn: number;
            category: import("../categories/category.entity").Category;
            subcategory: import("../categories/subcategory.entity").Subcategory | null;
            type: import("../categories/type.entity").Type | null;
            is_hidden: boolean;
            created_at: Date;
            totalSold: number;
            parameters: any[];
        }[];
        pagination: {
            total: number;
            page: number;
            perPage: number;
            totalPages: number;
        };
    }>;
    getByIds(ids: string): Promise<{
        id: number;
        sku: string;
        price_grn: number;
        is_hidden: boolean;
    }[]>;
    getNewProducts(limit?: string): Promise<{
        id: number;
        sku: string;
        price_usd: number;
        price_grn: number;
        category: import("../categories/category.entity").Category;
        subcategory: import("../categories/subcategory.entity").Subcategory | null;
        type: import("../categories/type.entity").Type | null;
        is_hidden: boolean;
        created_at: Date;
    }[]>;
    getOne(id: string, req: any): Promise<{
        id: number;
        sku: string;
        price_usd: number;
        price_grn: number;
        category: import("../categories/category.entity").Category;
        subcategory: import("../categories/subcategory.entity").Subcategory | null;
        type: import("../categories/type.entity").Type | null;
        is_hidden: boolean;
        created_at: Date;
    } | null>;
    create(body: {
        sku: string;
        price_usd: number;
        categoryId: number;
        subcategoryId?: number;
        typeId?: number;
    }): Promise<import("./product.entity").Product>;
    delete(id: string): Promise<import("typeorm").DeleteResult>;
    update(id: string, body: Partial<{
        sku: string;
        price_usd: number;
        categoryId: number;
        subcategoryId?: number;
        typeId?: number;
    }>): Promise<import("./product.entity").Product>;
    uploadPhoto(sku: string, file: Express.Multer.File): Promise<{
        message: string;
    }>;
    stream(res: express.Response, req: express.Request): Promise<void>;
    setHidden(id: string, hidden: boolean): Promise<import("./product.entity").Product>;
}
