import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { Subcategory } from './subcategory.entity';
import { Type } from './type.entity';
import { SubcategoryParameter } from '../categories/subcategory-parameter.entity';
@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
    @InjectRepository(Subcategory)
    private subcategoryRepo: Repository<Subcategory>,
    @InjectRepository(Type)
    private typeRepo: Repository<Type>,
    @InjectRepository(SubcategoryParameter)
    private subParamRepo: Repository<SubcategoryParameter>,
  ) {}

  // Всі категорії з підкатегоріями і типами
  async findAll() {
    const categories = await this.categoryRepo.find({
      relations: ['subcategories', 'subcategories.types', 'subcategories.parameters'],
    });
    return categories;
  }

  // CRUD категорії
  createCategory(name: string) {
    return this.categoryRepo.save(this.categoryRepo.create({ name }));
  }

  async updateCategory(id: number, name: string) {
    const category = await this.categoryRepo.findOne({ where: { id } });

    if (!category) {
      throw new BadRequestException('Категорія не знайдена');
    }

    category.name = name;
    return this.categoryRepo.save(category);
  }

  deleteCategory(id: number) {
    return this.categoryRepo.delete(id);
  }

  // CRUD підкатегорії
  createSubcategory(name: string, categoryId: number) {
    return this.subcategoryRepo.save(
      this.subcategoryRepo.create({ name, category: { id: categoryId } }),
    );
  }

  updateSubcategory(id: number, name: string) {
    return this.subcategoryRepo.update(id, { name });
  }

  deleteSubcategory(id: number) {
    return this.subcategoryRepo.delete(id);
  }

  // CRUD типу
  createType(name: string, subcategoryId: number) {
    return this.typeRepo.save(this.typeRepo.create({ name, subcategory: { id: subcategoryId } }));
  }

  updateType(id: number, name: string) {
    return this.typeRepo.update(id, { name });
  }

  deleteType(id: number) {
    return this.typeRepo.delete(id);
  }
  async findById(id: number): Promise<Category | null> {
    return this.categoryRepo.findOne({ where: { id } });
  }

  //CRUD для параметрів підкатегорії
  createSubcategoryParameter(
    subcategoryId: number,
    name: string,
    required = false,
  ) {
    return this.subParamRepo.save(
      this.subParamRepo.create({
        name,
        required,
        subcategory: { id: subcategoryId },
      }),
    );
  }

  async updateSubcategoryParameter(id: number, name: string, required = false) {
    const param = await this.subParamRepo.findOne({ where: { id } });
    if (!param) {
      throw new BadRequestException('Параметр не знайдено');
    }
    param.name = name;
    param.required = required;
    return this.subParamRepo.save(param);
  }

  deleteSubcategoryParameter(id: number) {
    return this.subParamRepo.delete(id);
  }
}