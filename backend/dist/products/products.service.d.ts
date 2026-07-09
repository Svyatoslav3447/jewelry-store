import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { Category } from '../categories/category.entity';
import { Subcategory } from '../categories/subcategory.entity';
import { Type } from '../categories/type.entity';
import { CurrencyService } from '../currency/currency.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SubcategoryParameter } from '../categories/subcategory-parameter.entity';
import { ProductParameter } from './product-parameter.entity';
export declare class ProductsService {
    private productRepo;
    private categoryRepo;
    private subcategoryRepo;
    private typeRepo;
    private currencyService;
    events: EventEmitter2;
    private subParamRepo;
    private productParamRepo;
    constructor(productRepo: Repository<Product>, categoryRepo: Repository<Category>, subcategoryRepo: Repository<Subcategory>, typeRepo: Repository<Type>, currencyService: CurrencyService, events: EventEmitter2, subParamRepo: Repository<SubcategoryParameter>, productParamRepo: Repository<ProductParameter>);
    create(data: {
        sku: string;
        price_usd: number;
        categoryId: number;
        subcategoryId?: number;
        typeId?: number;
        parameters?: {
            parameterId: number;
            value: string;
        }[];
    }): Promise<Product>;
    findAll(userRole?: 'ADMIN' | 'USER', page?: number, limit?: number, categoryId?: number, subcategoryId?: number, typeId?: number, search?: string, sort?: string): Promise<{
        data: {
            id: number;
            sku: string;
            price_usd: number;
            price_grn: number;
            category: Category;
            subcategory: Subcategory | null;
            type: Type | null;
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
    findByIds(ids: number[]): Promise<{
        id: number;
        sku: string;
        price_grn: number;
        is_hidden: boolean;
    }[]>;
    findOne(id: number, userRole?: 'ADMIN' | 'USER'): Promise<{
        id: number;
        sku: string;
        price_usd: number;
        price_grn: number;
        category: Category;
        subcategory: Subcategory | null;
        type: Type | null;
        is_hidden: boolean;
        created_at: Date;
    } | null>;
    delete(id: number): Promise<import("typeorm").DeleteResult>;
    updateStock(productId: number, quantity: number): Promise<Product>;
    getPopularProducts(limit?: number, userRole?: 'ADMIN' | 'USER'): Promise<{
        id: number;
        sku: string;
        price_usd: number;
        price_grn: number;
        category: Category;
        subcategory: Subcategory | null;
        type: Type | null;
        is_hidden: boolean;
        created_at: Date;
        totalSold: number;
        parameters: any[];
    }[]>;
    update(productId: number, data: Partial<{
        sku: string;
        price_usd: number;
        categoryId: number;
        subcategoryId?: number;
        typeId?: number;
        is_hidden?: boolean;
        parameters?: {
            parameterId: number;
            value: string;
        }[];
    }>): Promise<Product>;
    toggleHidden(productId: number, hidden: boolean): Promise<Product>;
    getNewProducts(limit?: number): Promise<{
        id: number;
        sku: string;
        price_usd: number;
        price_grn: number;
        category: Category;
        subcategory: Subcategory | null;
        type: Type | null;
        is_hidden: boolean;
        created_at: Date;
    }[]>;
}
