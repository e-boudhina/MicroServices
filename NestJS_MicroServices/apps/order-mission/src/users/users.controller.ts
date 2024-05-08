import { Body, Controller } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUsersDto } from "./dto/create-users.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly userService: UsersService) {
  };

  async store(@Body() createUsersDto: CreateUsersDto) {
    try{
      const result = await this.userService.create(createUsersDto);
      return result;
    }
    catch(error){
      return error;
    }
  }

  async getByUser(user_id:number){
    try {
      const result = await this.userService.findByUser(user_id);
      return result;
    }
    catch (error){
      return error;
    }
  }

  async getByOrderMission(order_mission_id : number){
    try{
      const result = await this.userService.findByOrderMission(order_mission_id);
      return result;
    }
    catch(error){
      return error;
    }
  }

  async getByUserAndOrder(order_mission_id:number , user_id:number){
    try{
      const result = await this.userService.findByUserAndOrder(user_id,order_mission_id);
      return result;
    }
    catch (error){
      return error;
    }
  }

}