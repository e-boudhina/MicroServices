import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "./entities/users.entity";
import { CreateUsersDto } from "./dto/create-users.dto";
import { Repository } from "typeorm";

@Injectable()
export class UsersService{
  constructor(@InjectRepository(Users) private readonly usersRepository : Repository<Users>) {
  };
  async create ( createUsersDto : CreateUsersDto):Promise<Users>{
   if (!createUsersDto.user_id) throw new BadRequestException('user id is required');
   else if (!createUsersDto.order_mission_id) throw new BadRequestException ('order mission id is required');
   const users = new Users(createUsersDto);
   const result = await this.usersRepository.save(users);
   return result;
  }

  async findAll(){
    return await this.usersRepository.find();
  };

  async findByUser(user_id: number) {
    const order_user = await this.usersRepository.find({
      where : {user_id : user_id}
    });
    if(!order_user) throw new NotFoundException('this user does not exits');
    return order_user;
  };

  async findByOrderMission(order_mission_id : number){
    const order_user = await this.usersRepository.find({
      where : {order_mission_id : order_mission_id}
    });
    if (!order_user) throw new NotFoundException('this order mission id does not exist');
    return order_user;
  };

  async findByUserAndOrder(user_id :number , order_mission_id :number){

    const order_users = await this.usersRepository.find ({
      where : {user_id : user_id , order_mission_id: order_mission_id}
    });

    if (!order_users) throw new NotFoundException('no data found');
    return order_users;
  };

  async DeleteUserFromOrder (order_mission_id :number , user_id:number){
    const order_user = await this.usersRepository.findOne({
      where : {order_mission_id : order_mission_id , user_id :user_id}
    });
    if (!order_user) throw new NotFoundException('those credentials does not match');
    const result = await this.usersRepository.delete(order_user);
    return {
      message : 'order deleted with success'
    };
  }
/*
  async deleteOrders (order_mission_id : number){
    const order_user  = await this.usersRepository.find({
      where : {order_mission_id : order_mission_id}
    });
    if (!order_user) throw new NotFoundException('this order mission id does not belong to any row');
    const result = await this.usersRepository.delete(order_user);
    return result;
  };
*/

}