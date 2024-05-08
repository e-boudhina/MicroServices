import { IsNumber } from "class-validator";

export class CreateUsersDto{
  @IsNumber()
  order_mission_id : number;
  @IsNumber()
  user_id : number;
}