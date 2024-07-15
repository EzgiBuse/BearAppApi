import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Bear } from './bear.entity';

@Entity()
export class Color {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Bear, (bear) => bear.colors)
  bears: Bear[];
}
