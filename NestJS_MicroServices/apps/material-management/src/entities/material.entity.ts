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
  OneToMany,
} from 'typeorm';
//import { OrderMission } from "src/order-mission/entities/order-mission.entity";
import { Category } from '../category/entities/category.entity';
import { Assignment } from '../assignment/entities/assignment.entity';
//import { Inventory } from "src/inventory/entities/inventory.entity";

@Entity()
export class Material {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  quantity: number;

  @Column({
    type: 'varchar',
    length: 10,
    default: 'InStock',
  })
  status: string;

  @ManyToOne(() => Category, (category) => category.materials)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @OneToMany(() => Assignment, (assignment) => assignment.material)
  assignments: Assignment[];

  //@OneToMany(() => Inventory, (inventory) => inventory.material)
  //inventories: Inventory[];

  //@ManyToOne(() => OrderMission, (orderMission) => orderMission.materials)
  // mission: OrderMission;
  // Autres attributs du matériel
}
