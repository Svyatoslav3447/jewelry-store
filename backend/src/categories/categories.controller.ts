import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Put, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  getAll() {
    return this.categoriesService.findAll();
  }

  @Post('category')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  createCategory(@Body('name') name: string) {
    return this.categoriesService.createCategory(name);
  }

  @Patch('category/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  updateCategory(@Param('id') id: string, @Body('name') name: string) {
    return this.categoriesService.updateCategory(Number(id), name);
  }

  @Delete('category/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  deleteCategory(@Param('id') id: string) {
    return this.categoriesService.deleteCategory(Number(id));
  }

  @Post('subcategory')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  createSubcategory(@Body() body: { name: string; categoryId: number }) {
    return this.categoriesService.createSubcategory(body.name, body.categoryId);
  }

  @Patch('subcategory/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  updateSubcategory(@Param('id') id: string, @Body('name') name: string) {
    return this.categoriesService.updateSubcategory(Number(id), name);
  }

  @Delete('subcategory/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  deleteSubcategory(@Param('id') id: string) {
    return this.categoriesService.deleteSubcategory(Number(id));
  }

  @Post('type')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  createType(@Body() body: { name: string; subcategoryId: number }) {
    return this.categoriesService.createType(body.name, body.subcategoryId);
  }

  @Patch('type/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  updateType(@Param('id') id: string, @Body('name') name: string) {
    return this.categoriesService.updateType(Number(id), name);
  }

  @Delete('type/:id')
  @Roles('ADMIN')
  deleteType(@Param('id') id: string) {
    return this.categoriesService.deleteType(Number(id));
  }

  @Put(':id/image')
  @UseInterceptors(FileInterceptor('image'))
  @Roles('ADMIN')
  async updateCategoryImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const category = await this.categoriesService.findById(+id); // await обов’язковий

    if (!category) {
      throw new BadRequestException('Категорія не знайдена');
    }

    // шлях до існуючого фото
    const imagePath = path.join(__dirname, '../../public/images/categories', `${category.name}.webp`);

    try {
      fs.writeFileSync(imagePath, file.buffer); // перезаписуємо існуючий файл
    } catch (err) {
      console.error(err);
      throw new BadRequestException('Помилка при записі фото');
    }

    return { message: 'Фото оновлено', image: `/images/categories/${category.name}.webp` };
  }

  @Post('subcategory-parameter')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  createParam(@Body() body: {
    subcategoryId: number;
    name: string;
    required?: boolean;
  }) {
    return this.categoriesService.createSubcategoryParameter(
      body.subcategoryId,
      body.name,
      body.required ?? false,
    );
  }

  @Patch('subcategory-parameter/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  updateParam(
    @Param('id') id: string,
    @Body() body: { name: string; required?: boolean },
  ) {
    return this.categoriesService.updateSubcategoryParameter(
      Number(id),
      body.name,
      body.required ?? false,
    );
  }

  @Delete('subcategory-parameter/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  deleteParam(@Param('id') id: string) {
    return this.categoriesService.deleteSubcategoryParameter(+id);
  }
}