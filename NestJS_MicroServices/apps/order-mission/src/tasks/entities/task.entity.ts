import { OrderMission } from "../../entities/order-mission.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "tasks"})
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name : string;

    @Column({type : "varchar" , default : "pending", length:10})
    status : string;


    @ManyToOne(() => OrderMission, (order_mission) => order_mission.tasks, {
        onDelete: "SET NULL",
      })
      @JoinColumn({ name: "order_mission_id" })
      order_mission_id: number;

   
      constructor(task: Partial<Task>) {
        Object.assign(this, task);
      }
   
}
