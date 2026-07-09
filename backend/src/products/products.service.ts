import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { Category } from '../categories/category.entity';
import { Subcategory } from '../categories/subcategory.entity';
import { Type } from '../categories/type.entity';
import { CurrencyService } from '../currency/currency.service';
import * as fs from 'fs';
import * as path from 'path';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BadRequestException } from '@nestjs/common';
import { SubcategoryParameter } from '../categories/subcategory-parameter.entity';
import { ProductParameter } from './product-parameter.entity';
import { In } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
    @InjectRepository(Subcategory)
    private subcategoryRepo: Repository<Subcategory>,
    @InjectRepository(Type)
    private typeRepo: Repository<Type>,
    private currencyService: CurrencyService,
    public events: EventEmitter2, // SSE

    @InjectRepository(SubcategoryParameter)
    private subParamRepo: Repository<SubcategoryParameter>,
    @InjectRepository(ProductParameter)
    private productParamRepo: Repository<ProductParameter>,
  ) {}

  async create(data: {
    sku: string;
    price_usd: number;
    categoryId: number;
    subcategoryId?: number;
    typeId?: number;
    parameters?: { parameterId: number; value: string }[];
  }) {
  
    const category = await this.categoryRepo.findOneBy({ id: data.categoryId });
    if (!category) throw new Error('Category not found');
  
    let subcategory: Subcategory | undefined;
    let type: Type | undefined;
  
    // --- SUBCATEGORY ---
    if (data.subcategoryId) {
      const foundSubcategory = await this.subcategoryRepo.findOne({
        where: { id: data.subcategoryId },
        relations: ['category'],
      });
  
      if (!foundSubcategory) throw new Error('Subcategory not found');
  
      if (foundSubcategory.category.id !== data.categoryId) {
        throw new Error('Subcategory does not belong to the given category');
      }
  
      subcategory = foundSubcategory;
  
      // --- REQUIRED PARAMETERS VALIDATION ---
      const requiredParams = await this.subParamRepo.find({
        where: {
          subcategory: { id: data.subcategoryId },
          required: true,
        },
      });
  
      if (requiredParams.length) {
  
        if (!data.parameters?.length) {
          throw new BadRequestException(
            'Для цієї підкатегорії потрібні параметри',
          );
        }
  
        for (const rp of requiredParams) {
  
          const exists = data.parameters.some(
            p => p.parameterId === rp.id,
          );
  
          if (!exists) {
            throw new BadRequestException(
              `Параметр "${rp.name}" обовʼязковий`,
            );
          }
  
        }
  
      }
    }
  
    // --- TYPE ---
    if (data.typeId) {
        const foundType = await this.typeRepo.findOneBy({ id: data.typeId });
        if (!foundType) throw new Error('Type not found');
        type = foundType;
    }
  
    // --- CREATE PRODUCT ---
    const product = this.productRepo.create({
      sku: data.sku,
      price_usd: data.price_usd,
      category,
      subcategory,
      type,
    });
    
    let saved: Product;
    
    try {
      saved = await this.productRepo.save(product);
    } catch (e) {
    
      if (e.code === '23505') {
        throw new BadRequestException('Товар з таким SKU вже існує');
      }
    
      throw e;
    }

  
    // --- SAVE PARAMETERS ---
    if (data.parameters?.length) {
  
      const productParams = data.parameters.map(p =>
        this.productParamRepo.create({
          product: saved,
          parameter: { id: p.parameterId } as any,
          value: p.value,
        }),
      );
  
      await this.productParamRepo.save(productParams);
    }
  
    // --- SSE EVENT ---
    this.events.emit('productUpdated', saved.id);
  
    return saved;
  }

  async findAll(
    userRole: 'ADMIN' | 'USER' = 'USER',
    page = 1,
    limit = 20,
    categoryId?: number,
    subcategoryId?: number,
    typeId?: number,
    search?: string,
    sort?: string
  ) {
  
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
  
      const totalSold =
        product.orderItems?.reduce(
          (sum, oi) => sum + (oi.quantity ?? 0),
          0
        ) ?? 0;
  
      const parametersMap = new Map<number, any>();
  
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
  
  async findByIds(ids: number[]) {
    if (!ids.length) return [];
  
    // Перевірка валідності id
    const validIds = ids.filter(id => Number.isInteger(id) && id > 0);
    if (!validIds.length) return [];
  
    try {
      const products = await this.productRepo.find({
        where: { id: In(validIds) },
        relations: ['category', 'subcategory', 'type'],
      });
  
      const rate = await this.currencyService.getCurrentRate();
  
      return products.map(p => ({
        id: p.id,
        sku: p.sku,
        price_grn: Math.round(Number(p.price_usd) * rate),
        is_hidden: p.is_hidden,
      }));
    } catch (e) {
      console.error('Error in findByIds:', e);
      throw new BadRequestException('Помилка при отриманні продуктів');
    }
  }
  
  async findOne(id: number, userRole?: 'ADMIN' | 'USER') {
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
    if (!product) return null;

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
      // stock: product.stock,
    };

    if (userRole !== 'ADMIN') {
      const { /*stock,*/ ...rest } = productObj;
      return rest;
    }

    return productObj;
  }

  async delete(id: number) {
    const res = await this.productRepo.delete(id);
    this.events.emit('productUpdated', id);
    return res;
  }

  async updateStock(productId: number, quantity: number) {
    const product = await this.productRepo.findOneBy({ id: productId });
    if (!product) throw new Error('Product not found');

    product['stock'] = quantity;
    const saved = await this.productRepo.save(product);
    this.events.emit('productUpdated', productId);
    return saved;
  }

  async getPopularProducts(limit = 6, userRole?: 'ADMIN' | 'USER') {
    const { data } = await this.findAll(userRole); // деструктуризація
    return data
      .sort((a, b) => (b.totalSold ?? 0) - (a.totalSold ?? 0))
      .slice(0, limit);
  }

async update(
  productId: number,
  data: Partial<{
    sku: string;
    price_usd: number;
    categoryId: number;
    subcategoryId?: number;
    typeId?: number;
    is_hidden?: boolean;
    parameters?: { parameterId: number; value: string }[];
  }>
) {
  const product = await this.productRepo.findOne({
    where: { id: productId },
    relations: ['category', 'subcategory', 'type'],
  });
  if (!product) throw new Error('Product not found');

  // Видаляємо старі параметри
  await this.productParamRepo.delete({
    product: { id: productId },
  });

  const uploadDir = './public/images/products';
  const oldFile = path.join(uploadDir, `${product.sku}.webp`);

  if (data.sku && data.sku !== product.sku) {
    const newFile = path.join(uploadDir, `${data.sku}.webp`);
    if (fs.existsSync(newFile)) fs.unlinkSync(newFile);
    if (fs.existsSync(oldFile)) fs.renameSync(oldFile, newFile);
    product.sku = data.sku;
  }

  if (data.price_usd !== undefined) product.price_usd = data.price_usd;

  if (data.categoryId !== undefined) {
    const category = await this.categoryRepo.findOneBy({ id: data.categoryId });
    if (!category) throw new Error('Category not found');
    product.category = category;
  }

  if (data.subcategoryId === null) {
    product.subcategory = null;
    product.type = null;
  } else if (data.subcategoryId !== undefined) {
    const subcategory = await this.subcategoryRepo.findOne({
      where: { id: data.subcategoryId },
      relations: ['category'],
    });
    if (!subcategory) throw new Error('Subcategory not found');
    if (subcategory.category.id !== product.category.id)
      throw new Error('Subcategory does not belong to category');
    product.subcategory = subcategory;
  }

  if (data.typeId === null) {
    product.type = null;
  } else if (data.typeId !== undefined) {
    const type = await this.typeRepo.findOneBy({ id: data.typeId });
    if (!type) throw new Error('Type not found');
    product.type = type;
  }

  if (data.is_hidden !== undefined) {
    product.is_hidden = data.is_hidden;
  }

  // Додаємо нові параметри
  if (data.parameters?.length) {
    const productParams = data.parameters.map(p =>
      this.productParamRepo.create({
        product: product,
        parameter: { id: p.parameterId } as any,
        value: p.value,
      }),
    );

    await this.productParamRepo.save(productParams);
  }

  const saved = await this.productRepo.save(product);
  this.events.emit('productUpdated', productId);
  return saved;
}

  async toggleHidden(productId: number, hidden: boolean) {
    const product = await this.productRepo.findOneBy({ id: productId });
    if (!product) throw new Error('Product not found');

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
}











