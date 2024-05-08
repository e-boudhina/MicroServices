import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'leave_table'})
export class Leave {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default : null})
  employee_id : number

  @Column({default : null})
  informations : string

  @Column({type: "varchar" , length :20})
  reason : string

  @Column({default : 'pending'})
  status : string

  @Column({type : "date"})
  start_date : Date

  @Column({type : "date"})
  end_date : Date

  constructor(Leave : Partial<Leave>) {
    Object.assign(this, Leave);
  }
}