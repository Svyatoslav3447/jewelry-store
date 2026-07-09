import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './category.entity';
import { Subcategory } from './subcategory.entity';
import { Type } from './type.entity';
import { AuthModule } from '../auth/auth.module';
import { SubcategoryParameter } from '../categories/subcategory-parameter.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Subcategory, Type, SubcategoryParameter,]), AuthModule],
  providers: [CategoriesService],
  controllers: [CategoriesController],
  exports: [CategoriesService],
})
export class CategoriesModule {}