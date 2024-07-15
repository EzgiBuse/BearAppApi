import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Color } from './color.entity';

@Entity()
export class Bear {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  size: number;

  @ManyToMany(() => Color, (color) => color.bears, {
    cascade: true,
  })
  @JoinTable()
  colors: Color[];
}
