import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Subcategory } from './subcategory.entity';

@Entity('types')
export class Type {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @ManyToOne(() => Subcategory, subcategory => subcategory.types, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'subcategory_id' })
  subcategory!: Subcategory;

  @CreateDateColumn()
  created_at!: Date;
}