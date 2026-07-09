import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Subcategory } from './subcategory.entity';

@Entity('subcategory_parameters')
export class SubcategoryParameter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // size, length, color

  @Column({ default: false })
  required: boolean;

  @ManyToOne(() => Subcategory, sub => sub.parameters, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'subcategory_id' })
  subcategory: Subcategory;
}