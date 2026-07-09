import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, JoinColumn } from 'typeorm';
import { Category } from './category.entity';
import { Type } from './type.entity';
import { SubcategoryParameter } from './subcategory-parameter.entity';

@Entity('subcategories')
export class Subcategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Category, category => category.subcategories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Type, type => type.subcategory)
  types: Type[];

  @OneToMany(() => SubcategoryParameter, p => p.subcategory)
  parameters: SubcategoryParameter[];
}