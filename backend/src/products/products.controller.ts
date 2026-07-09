import { Controller, Get, Post, Patch, Body, Param, Delete, UseGuards, Req, Res, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt.guard';
import { UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';
import express from 'express';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  // --- Адмін може редагувати stock ---
  @Patch(':id/stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  updateStock(
    @Param('id') id: string,
    @Body('quantity') quantity: number,
  ) {
    return this.productsService.updateStock(Number(id), quantity);
  }

  // --- Популярні продукти ---
  @Get('popular')
  getPopular() {
    return this.productsService.getPopularProducts();
  }

  // --- Всі продукти ---
  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  getAll(
    @Req() req,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('categoryId') categoryId?: string,
    @Query('subcategoryId') subcategoryId?: string,
    @Query('typeId') typeId?: string,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
  ) {
    const role = req.user?.role ?? 'USER';
  
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
  
    // --- перетворюємо айдішки з string в number ---
    const categoryIdNum = categoryId ? parseInt(categoryId) : undefined;
    const subcategoryIdNum = subcategoryId ? parseInt(subcategoryId) : undefined;
    const typeIdNum = typeId ? parseInt(typeId) : undefined;
  
    return this.productsService.findAll(
      role,
      pageNum,
      limitNum,
      categoryIdNum,
      subcategoryIdNum,
      typeIdNum,
      search,
      sort,
    );
  }

  @Get('by-ids')
  async getByIds(@Query('ids') ids: string) {
    const idsArray = ids.split(',').map(id => parseInt(id, 10)).filter(id => !isNaN(id));
    return this.productsService.findByIds(idsArray);
  }

  @Get('new')
  getNewProducts(@Query('limit') limit?: string) {
    const limitNum = limit ? Number(limit) : 4;
    return this.productsService.getNewProducts(limitNum || 4);
  }
  
  // --- Один продукт ---
  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  getOne(@Param('id') id: string, @Req() req) {
    const role = req.user?.role ?? 'USER';
    return this.productsService.findOne(Number(id), role);
  }
  
  // --- Створити продукт ---
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  create(@Body() body: { sku: string; price_usd: number; categoryId: number; subcategoryId?: number; typeId?: number }) {
    return this.productsService.create(body);
  }

  // --- Видалити продукт ---
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  delete(@Param('id') id: string) {
    return this.productsService.delete(Number(id));
  }

  // --- Оновити продукт ---
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  update(
    @Param('id') id: string,
    @Body() body: Partial<{ sku: string; price_usd: number; categoryId: number; subcategoryId?: number; typeId?: number }>
  ) {
    return this.productsService.update(Number(id), body);
  }

  // --- Завантажити фото продукту ---
  @Post(':sku/upload-photo')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './public/images/products',
      filename: (req, file, cb) => cb(null, `temp_${Date.now()}`),
    }),
  }))
  async uploadPhoto(
    @Param('sku') sku: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const uploadDir = './public/images/products';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const outputFile = path.join(uploadDir, `${sku}.webp`);

    // Видаляємо старі фото SKU
    const files = fs.readdirSync(uploadDir);
    files.forEach(f => {
      if (f.startsWith(sku) && f !== `${sku}.webp`) {
        fs.unlinkSync(path.join(uploadDir, f));
      }
    });

    if (file.mimetype === 'image/webp') {
      fs.renameSync(file.path, outputFile);
    } else {
      await sharp(file.path)
        .webp({ quality: 90 })
        .toFile(outputFile);
      fs.unlinkSync(file.path);
    }

    return { message: 'Фото успішно завантажено' };
  }

  // --- SSE: потік оновлень товарів ---
  @Get('updates/stream')
  async stream(@Res() res: express.Response, @Req() req: express.Request) {
    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });
    res.flushHeaders();

    // Надсилаємо інструкцію повторного підключення
    res.write('retry: 3000\n\n');

    const sendUpdate = async (productId: number) => {
      const product = await this.productsService.findOne(productId, 'USER');
      if (!product) return;
      res.write(`data: ${JSON.stringify(product)}\n\n`);
    };

    const listener = (productId: number) => sendUpdate(productId);
    this.productsService.events.on('productUpdated', listener);

    // Закриття з'єднання
    req.on('close', () => {
      this.productsService.events.off('productUpdated', listener);
      res.end();
    });
  }

  @Patch(':id/hidden')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  setHidden(
    @Param('id') id: string,
    @Body('hidden') hidden: boolean,
  ) {
    return this.productsService.toggleHidden(Number(id), hidden);
  }
}




