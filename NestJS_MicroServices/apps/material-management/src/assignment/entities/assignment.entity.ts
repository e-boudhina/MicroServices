import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Material } from '../../entities/material.entity';
import { User } from 'apps/auth/src/users/entities/user.entity';
@Entity()
export class Assignment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Material, (material) => material.assignments)
  material: Material;

  //@ManyToOne(() => User, (user) => user.assignments)
  user: User;

  @Column({ nullable: true })
  returnDate: Date;

  // Autres attributs de l'attribution
}
