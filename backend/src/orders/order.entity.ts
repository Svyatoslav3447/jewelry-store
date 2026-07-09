import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';

export enum OrderStatus {
  PENDING = 'Нове',
  PROCESSING = 'В обробці',
  COMPLETED = 'Завершено',
  CANCELLED = 'Відмінено',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ name: 'first_name', type: 'varchar', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 100, nullable: true })
  lastName?: string;

  @Column({ type: 'varchar', length: 30 })
  phone: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  delivery?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city?: string;

  @Column({ name: 'npBranch', type: 'varchar', length: 255, nullable: true })
  npBranch?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  payment?: string;

  @Column({ name: 'callConfirm', type: 'varchar', length: 10, nullable: true })
  callConfirm?: string;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  // --- Нові поля для знижки ---
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total_after_discount: number;

  @Column({ type: 'int', default: 0 })
  discount_percent: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @OneToMany(() => OrderItem, item => item.order, { cascade: true })
  items: OrderItem[];
}

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, order => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column()
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price_usd: number;

  @Column({ type: 'json', name: 'selected_params', nullable: true })
  selectedParams: Record<number, string>;
  
  selectedParamsNames?: Record<number, string>;

}
