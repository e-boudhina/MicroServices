import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({name: "users"})
export class Users{
  @PrimaryColumn()
  order_mission_id : number;

  @PrimaryColumn()
  user_id : number;


  constructor(users: Partial<Users>) {
    Object.assign(this, users);
  }
}