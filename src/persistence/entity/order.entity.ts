import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  bearId: number;

  @Column()
  colorId: number;

  @Column()
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
