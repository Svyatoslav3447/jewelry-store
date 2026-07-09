import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { SubcategoryParameter } from '../categories/subcategory-parameter.entity';

@Entity('product_parameters')
export class ProductParameter {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, product => product.parameters, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => SubcategoryParameter, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parameter_id' })
  parameter: SubcategoryParameter;

  @Column()
  value: string;
}