import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Category } from '../categories/category.entity';
import { Subcategory } from '../categories/subcategory.entity';
import { Type } from '../categories/type.entity';
import { OneToMany } from 'typeorm';
import { OrderItem } from '../orders/order.entity';
import { ProductParameter } from './product-parameter.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  sku: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price_usd: number;

  @ManyToOne(() => Category, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Subcategory, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'subcategory_id' })
  subcategory: Subcategory | null;

  @ManyToOne(() => Type, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'type_id' })
  type: Type | null;

  // @Column({ default: 0 })
  // stock: number;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => OrderItem, orderItem => orderItem.product)
  orderItems: OrderItem[];

  @OneToMany(() => ProductParameter, pp => pp.product)
  parameters: ProductParameter[];
  
  @Column({ default: false })
  is_hidden: boolean;
}