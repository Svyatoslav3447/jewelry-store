"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./product.entity");
const category_entity_1 = require("../categories/category.entity");
const subcategory_entity_1 = require("../categories/subcategory.entity");
const type_entity_1 = require("../categories/type.entity");
const currency_service_1 = require("../currency/currency.service");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const event_emitter_1 = require("@nestjs/event-emitter");
const common_2 = require("@nestjs/common");
const subcategory_parameter_entity_1 = require("../categories/subcategory-parameter.entity");
const product_parameter_entity_1 = require("./product-parameter.entity");
const typeorm_3 = require("typeorm");
let ProductsService = class ProductsService {
    productRepo;
    categoryRepo;
    subcategoryRepo;
    typeRepo;
    currencyService;
    events;
    subParamRepo;
    productParamRepo;
    constructor(productRepo, categoryRepo, subcategoryRepo, typeRepo, currencyService, events, subParamRepo, productParamRepo) {
        this.productRepo = productRepo;
        this.categoryRepo = categoryRepo;
        this.subcategoryRepo = subcategoryRepo;
        this.typeRepo = typeRepo;
        this.currencyService = currencyService;
        this.events = events;
        this.subParamRepo = subParamRepo;
        this.productParamRepo = productParamRepo;
    }
    async create(data) {
        const category = await this.categoryRepo.findOneBy({ id: data.categoryId });
        if (!category)
            throw new Error('Category not found');
        let subcategory;
        let type;
        if (data.subcategoryId) {
            const foundSubcategory = await this.subcategoryRepo.findOne({
                where: { id: data.subcategoryId },
                relations: ['category'],
            });
            if (!foundSubcategory)
                throw new Error('Subcategory not found');
            if (foundSubcategory.category.id !== data.categoryId) {
                throw new Error('Subcategory does not belong to the given category');
            }
            subcategory = foundSubcategory;
            const requiredParams = await this.subParamRepo.find({
                where: {
                    subcategory: { id: data.subcategoryId },
                    required: true,
                },
            });
            if (requiredParams.length) {
                if (!data.parameters?.length) {
                    throw new common_2.BadRequestException('Для цієї підкатегорії потрібні параметри');
                }
                for (const rp of requiredParams) {
                    const exists = data.parameters.some(p => p.parameterId === rp.id);
                    if (!exists) {
                        throw new common_2.BadRequestException(`Параметр "${rp.name}" обовʼязковий`);
                    }
                }
            }
        }
        if (data.typeId) {
            const foundType = await this.typeRepo.findOneBy({ id: data.typeId });
            if (!foundType)
                throw new Error('Type not found');
            type = foundType;
        }
        const product = this.productRepo.create({
            sku: data.sku,
            price_usd: data.price_usd,
            category,
            subcategory,
            type,
        });
        let saved;
        try {
            saved = await this.productRepo.save(product);
        }
        catch (e) {
            if (e.code === '23505') {
                throw new common_2.BadRequestException('Товар з таким SKU вже існує');
            }
            throw e;
        }
        if (data.parameters?.length) {
            const productParams = data.parameters.map(p => this.productParamRepo.create({
                product: saved,
                parameter: { id: p.parameterId },
                value: p.value,
            }));
            await this.productParamRepo.save(productParams);
        }
        this.events.emit('productUpdated', saved.id);
        return saved;
    }
    async findAll(userRole = 'USER', page = 1, limit = 20, categoryId, subcategoryId, typeId, search, sort) {
        const qb = this.productRepo
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.subcategory', 'subcategory')
            .leftJoinAndSelect('product.type', 'type')
            .leftJoinAndSelect('product.orderItems', 'orderItems')
            .leftJoinAndSelect('product.parameters', 'parameters')
            .leftJoinAndSelect('parameters.parameter', 'parameter');
        if (categoryId) {
            qb.andWhere('category.id = :categoryId', { categoryId });
        }
        if (subcategoryId) {
            qb.andWhere('subcategory.id = :subcategoryId', { subcategoryId });
        }
        if (typeId) {
            qb.andWhere('type.id = :typeId', { typeId });
        }
        if (search) {
            qb.andWhere('LOWER(product.sku) LIKE :search', {
                search: `%${search.toLowerCase()}%`,
            });
        }
        switch (sort) {
            case 'name':
                qb.orderBy('product.sku', 'ASC');
                break;
            case 'price_asc':
                qb.orderBy('product.price_usd', 'ASC');
                break;
            case 'price_desc':
                qb.orderBy('product.price_usd', 'DESC');
                break;
            default:
                qb.orderBy('product.id', 'ASC');
        }
        qb.skip((page - 1) * limit).take(limit);
        const [products, total] = await qb.getManyAndCount();
        const rate = await this.currencyService.getCurrentRate();
        const mapped = products.map(product => {
            const totalSold = product.orderItems?.reduce((sum, oi) => sum + (oi.quantity ?? 0), 0) ?? 0;
            const parametersMap = new Map();
            product.parameters?.forEach(p => {
                const key = p.parameter.id;
                if (!parametersMap.has(key)) {
                    parametersMap.set(key, {
                        parameter: {
                            id: p.parameter.id,
                            name: p.parameter.name
                        },
                        values: []
                    });
                }
                parametersMap.get(key).values.push(p.value);
            });
            return {
                id: product.id,
                sku: product.sku,
                price_usd: product.price_usd,
                price_grn: Math.round(Number(product.price_usd) * rate),
                category: product.category,
                subcategory: product.subcategory,
                type: product.type,
                is_hidden: product.is_hidden,
                created_at: product.created_at,
                totalSold,
                parameters: Array.from(parametersMap.values())
            };
        });
        return {
            data: mapped,
            pagination: {
                total,
                page,
                perPage: limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findByIds(ids) {
        if (!ids.length)
            return [];
        const validIds = ids.filter(id => Number.isInteger(id) && id > 0);
        if (!validIds.length)
            return [];
        try {
            const products = await this.productRepo.find({
                where: { id: (0, typeorm_3.In)(validIds) },
                relations: ['category', 'subcategory', 'type'],
            });
            const rate = await this.currencyService.getCurrentRate();
            return products.map(p => ({
                id: p.id,
                sku: p.sku,
                price_grn: Math.round(Number(p.price_usd) * rate),
                is_hidden: p.is_hidden,
            }));
        }
        catch (e) {
            console.error('Error in findByIds:', e);
            throw new common_2.BadRequestException('Помилка при отриманні продуктів');
        }
    }
    async findOne(id, userRole) {
        const product = await this.productRepo.findOne({
            where: { id },
            relations: [
                'category',
                'subcategory',
                'type',
                'parameters',
                'parameters.parameter',
            ],
        });
        if (!product)
            return null;
        const rate = await this.currencyService.getCurrentRate();
        const productObj = {
            id: product.id,
            sku: product.sku,
            price_usd: product.price_usd,
            price_grn: Math.round(Number(product.price_usd) * rate),
            category: product.category,
            subcategory: product.subcategory,
            type: product.type,
            is_hidden: product.is_hidden,
            created_at: product.created_at,
        };
        if (userRole !== 'ADMIN') {
            const { ...rest } = productObj;
            return rest;
        }
        return productObj;
    }
    async delete(id) {
        const res = await this.productRepo.delete(id);
        this.events.emit('productUpdated', id);
        return res;
    }
    async updateStock(productId, quantity) {
        const product = await this.productRepo.findOneBy({ id: productId });
        if (!product)
            throw new Error('Product not found');
        product['stock'] = quantity;
        const saved = await this.productRepo.save(product);
        this.events.emit('productUpdated', productId);
        return saved;
    }
    async getPopularProducts(limit = 6, userRole) {
        const { data } = await this.findAll(userRole);
        return data
            .sort((a, b) => (b.totalSold ?? 0) - (a.totalSold ?? 0))
            .slice(0, limit);
    }
    async update(productId, data) {
        const product = await this.productRepo.findOne({
            where: { id: productId },
            relations: ['category', 'subcategory', 'type'],
        });
        if (!product)
            throw new Error('Product not found');
        await this.productParamRepo.delete({
            product: { id: productId },
        });
        const uploadDir = './public/images/products';
        const oldFile = path.join(uploadDir, `${product.sku}.webp`);
        if (data.sku && data.sku !== product.sku) {
            const newFile = path.join(uploadDir, `${data.sku}.webp`);
            if (fs.existsSync(newFile))
                fs.unlinkSync(newFile);
            if (fs.existsSync(oldFile))
                fs.renameSync(oldFile, newFile);
            product.sku = data.sku;
        }
        if (data.price_usd !== undefined)
            product.price_usd = data.price_usd;
        if (data.categoryId !== undefined) {
            const category = await this.categoryRepo.findOneBy({ id: data.categoryId });
            if (!category)
                throw new Error('Category not found');
            product.category = category;
        }
        if (data.subcategoryId === null) {
            product.subcategory = null;
            product.type = null;
        }
        else if (data.subcategoryId !== undefined) {
            const subcategory = await this.subcategoryRepo.findOne({
                where: { id: data.subcategoryId },
                relations: ['category'],
            });
            if (!subcategory)
                throw new Error('Subcategory not found');
            if (subcategory.category.id !== product.category.id)
                throw new Error('Subcategory does not belong to category');
            product.subcategory = subcategory;
        }
        if (data.typeId === null) {
            product.type = null;
        }
        else if (data.typeId !== undefined) {
            const type = await this.typeRepo.findOneBy({ id: data.typeId });
            if (!type)
                throw new Error('Type not found');
            product.type = type;
        }
        if (data.is_hidden !== undefined) {
            product.is_hidden = data.is_hidden;
        }
        if (data.parameters?.length) {
            const productParams = data.parameters.map(p => this.productParamRepo.create({
                product: product,
                parameter: { id: p.parameterId },
                value: p.value,
            }));
            await this.productParamRepo.save(productParams);
        }
        const saved = await this.productRepo.save(product);
        this.events.emit('productUpdated', productId);
        return saved;
    }
    async toggleHidden(productId, hidden) {
        const product = await this.productRepo.findOneBy({ id: productId });
        if (!product)
            throw new Error('Product not found');
        product.is_hidden = hidden;
        const saved = await this.productRepo.save(product);
        this.events.emit('productUpdated', productId);
        return saved;
    }
    async getNewProducts(limit = 4) {
        const products = await this.productRepo.find({
            relations: ['category', 'subcategory', 'type'],
            order: { created_at: 'DESC' },
            take: limit,
        });
        const rate = await this.currencyService.getCurrentRate();
        return products.map(p => ({
            id: p.id,
            sku: p.sku,
            price_usd: p.price_usd,
            price_grn: Math.round(Number(p.price_usd) * rate),
            category: p.category,
            subcategory: p.subcategory,
            type: p.type,
            is_hidden: p.is_hidden,
            created_at: p.created_at,
        }));
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(2, (0, typeorm_1.InjectRepository)(subcategory_entity_1.Subcategory)),
    __param(3, (0, typeorm_1.InjectRepository)(type_entity_1.Type)),
    __param(6, (0, typeorm_1.InjectRepository)(subcategory_parameter_entity_1.SubcategoryParameter)),
    __param(7, (0, typeorm_1.InjectRepository)(product_parameter_entity_1.ProductParameter)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        currency_service_1.CurrencyService,
        event_emitter_1.EventEmitter2,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map