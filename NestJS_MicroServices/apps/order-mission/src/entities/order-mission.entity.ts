import { Task } from '../tasks/entities/task.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn, JoinTable, ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";


@Entity({ name: "order_mission" })
export class OrderMission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  destination: string;

  @Column({type : "date"})
  departure_date: Date;

  @Column({type : "date"})
  return_date: Date;

  @Column()
  budget: number;

  @Column({default : 0 , comment : "number of kilometers"})
  mileage : number;

  @Column({type: "varchar" , length :10 , default : "scheduled", comment: "this column can be scheduled , progress , finished "})
  status: string;

  @Column({comment: "departure place"})
  origin : string;

  @Column({default : null})
  observations : string;

  @Column({type: "date" , default : null})
  emission_date : Date;
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;


  @OneToMany(() => Task, (task) => task.order_mission_id)
  tasks: Task[];


  @Column()
  materials: number;
  
  constructor(OrderMission: Partial<OrderMission>) {
    Object.assign(this, OrderMission);
  }
}
