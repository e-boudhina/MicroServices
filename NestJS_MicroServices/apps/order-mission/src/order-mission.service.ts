import {
  BadRequestException, Body, Get,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Post
} from "@nestjs/common";
import { CreateOrderMissionDto } from "./dto/create-order-mission.dto";
import { UpdateOrderMissionDto } from "./dto/update-order-mission.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderMission } from "./entities/order-mission.entity";
import {In, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Repository} from "typeorm";
import {isNotIn} from "class-validator";
import {Task} from "./tasks/entities/task.entity";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom, Observable } from "rxjs";
import { Users } from "./users/entities/users.entity";
import { User } from "../../auth/src/users/entities/user.entity";
import { CreateUsersDto } from "./users/dto/create-users.dto";




@Injectable()
export class OrderMissionService {

  constructor(
    @InjectRepository(OrderMission)
    private readonly orderMissionsRepository: Repository<OrderMission>,
    @InjectRepository(Users)
    private readonly usersRepository : Repository<Users>,
    @Inject('AUTH') private readonly AuthService: ClientProxy
  ) {};

  // create a single order mission
  async create(
     createOrderMissionDto: CreateOrderMissionDto,
  ): Promise<OrderMission> {

      // create a new order mission 
      const orderMission = new OrderMission(createOrderMissionDto);

      if (orderMission.departure_date > orderMission.return_date){
        throw new Error('depart date should not be greater than return date');
      }
      orderMission.departure_date = new Date(createOrderMissionDto.departure_date);
      orderMission.return_date = new Date(createOrderMissionDto.return_date);

      // assigning the users to order mission variable before inserting it
     // orderMission.users = users;

      const result = await this.orderMissionsRepository.save(orderMission);
    /*
      if (result){
        await this.handleBudget(orderMission , "add");
      } */
      if (result){
        return  result;
      }

    
    
  };


  // retreive all order missions in database
  async findAll(): Promise<OrderMission[]> {
    return await this.orderMissionsRepository.find();
  }

  // return a single order mission based on id
  async findOne(id: number): Promise<OrderMission> {
    const orderMission = await this.orderMissionsRepository.findOne({
      where: { id: id },
    });
    if (!orderMission) throw new NotFoundException("order mission not found");
    return orderMission;
  };

  //update a single order mission based on his id
  async update(id: number, updateOrderMissionDto: UpdateOrderMissionDto) {
  

      const orderMission = await this.orderMissionsRepository.findOne({
        where: { id: id },
      });

      // throw an error if the order mission is not found
      if (!orderMission) throw new NotFoundException("order mission not found");
    
      if (updateOrderMissionDto.departure_date && updateOrderMissionDto.return_date){
        if (new Date(updateOrderMissionDto.departure_date) >= new Date( updateOrderMissionDto.return_date)){

          throw new BadRequestException('depart date should not be greater than return date');
        }
      }
      else if (updateOrderMissionDto.return_date){
        if (new Date(updateOrderMissionDto.return_date) <= new Date(orderMission.departure_date) ){
          throw new BadRequestException('depart date should not be lower than return date');
        }
      }
      else if (updateOrderMissionDto.departure_date ){
        if (new Date(updateOrderMissionDto.departure_date) >= new Date( orderMission.return_date)){
          throw new BadRequestException('depart date should not be greater than return date');
        }
      }
    updateOrderMissionDto.departure_date = new Date(updateOrderMissionDto.departure_date);
    updateOrderMissionDto.return_date = new Date(updateOrderMissionDto.return_date);
      // updating the order mission
       await this.orderMissionsRepository.update(id, updateOrderMissionDto);
      // Retrieve the updated OrderMission
      const updatedOrderMission = await this.orderMissionsRepository.findOne({where: { id: id },}); 

      if (updatedOrderMission) {
        /*
        await  this.handleBudget(orderMission, "minus");
        await this.handleBudget(updatedOrderMission,"add");
        */
        return updatedOrderMission;
      }

  };

  //delete a mission order based on id
  async remove(id: number) {

        const orderMission = await this.orderMissionsRepository.findOne({
          where: { id: id },
        });

        if (!orderMission) throw new NotFoundException("order mission not found");
         const result = await this.orderMissionsRepository.delete(id);
         if (result) {
           this.deleteOrders(id);
          // update the total budget after deleting a mission
         //await this.handleBudget(orderMission,"minus");
          return { message: 'order mission successfully deleted', id };
         }
  };


   async currentAvailableEmployee(){

     // getting the current date
     const Current_date = new Date();

     // returning all the current missions (depart date is lower than the current date and return date is higher than current date).

    const occupiedOrders = await this.orderMissionsRepository
        .createQueryBuilder("orderMission")
        .select("orderMission.id")
        .where("orderMission.departure_date <= :current_date" , {current_date : Current_date})
        .andWhere("orderMission.return_date >= :current_date" , {current_date : Current_date})
        .getMany();
    // creating an array which have only the ids of order missions
     const occupiedOrdersIds = occupiedOrders.map(order => order.id);

     const occupiedUsers = await this.usersRepository
       .createQueryBuilder("users")
       .select("users.user_id")
       .where("users.order_mission_id IN (:...occupiedOrdersIds)", {occupiedOrdersIds})
       .getMany();


       // Filter out duplicate users based on id
       const OccupiedUsersFiltred = occupiedUsers.filter((user, index, self) =>
           index === self.findIndex(u => u.user_id === user.user_id)
       );
       // Extracting only IDs from objects in the OccupiedUsers array
       const occupiedUsersFiltredIds = OccupiedUsersFiltred.map(user => user.user_id);

     const pattern = { cmd: 'get_users_not_in_ids' };

     return  this.AuthService.send(pattern, occupiedUsersFiltredIds);

    /*
       // searching for users with ids different than the occupied id users
       const entitiesNotInIds = await this.userRepository
           .createQueryBuilder('users')
           .where('users.id NOT IN (:...ids)', { ids :occupiedUserIds })
           .getMany();


     return entitiesNotInIds;
*/
   };


   async getUsersByMissions(mission_id : number)  {
     const users = await this.usersRepository.find({
       where : {order_mission_id : mission_id}
     });
     if (users.length == 0) return null;
     else {
       const usersInfos = [];
       const pattern = { cmd: 'get_users_by_ids' };

       users.map( user => {
         usersInfos.push( user.user_id);
       });

       return  this.AuthService.send(pattern, usersInfos);
     }

   }
   // affect the user to an order mission
   async addUserToMission(order_mission_id : number , user_id : number){


     //checking if mission order with this id exists
     const order_mission: OrderMission = await this.orderMissionsRepository.findOne({
       where : {id : order_mission_id},
     });

     if (! order_mission){
       throw new NotFoundException('order mission not found !');
     };

     // checking if an user with this id exists
     const pattern = { cmd: 'get_user_by_id' };
     const users =  await lastValueFrom( this.AuthService.send(pattern, user_id));
     if (users.message) throw new NotFoundException('the user with this id does not exists');




     const result = await this.usersRepository.save({
       order_mission_id,
       user_id
     });

       if (result ){
           return {
               message : 'user added' ,
           }
       }
    }


    // delete user from order mission
    async deleteUserFromMission (mission_id : number,user_id : number) {

       // checking if the user is related to the order_mission or not
       const user = await this.usersRepository.findOne({
         where: { order_mission_id: mission_id, user_id: user_id }
       });
       if (!user) throw new NotFoundException('the user does not belong to the order mission');
       else {
         const result = await this.usersRepository.delete(user);
         if (result) {
           return { message: 'user deleted from order mission' };
         }
       }
     }
 async deleteOrders(mission_id :number){
     //check if the order mission has users related to it
    const orders = await this.usersRepository.find({
      where : {order_mission_id : mission_id}
    });
    if (orders.length == 0 ) throw new NotFoundException('this order mission does not have any user related to it');
    const result = await this.usersRepository.remove(orders);
 }

// get tasks by mission
    async getTasksByMissions(order_mission_id) : Promise<Task[]>{
       const orderMission = await this.orderMissionsRepository.findOne({
            where : {id : order_mission_id},
           relations : ['tasks'],
           select: ['tasks' ,'id']
        })
        if (! orderMission) throw new NotFoundException("order mission not found");

       return orderMission.tasks;
    }
/*
// function to handle interactions with budget table : based on operation parameter we will change the total budget
async  handleBudget (orderMission : OrderMission , operation : string) {
  
     // retrieving the year from depart_date request
     const  year = new Date(orderMission.departure_date).getFullYear();
      // searching for the budget of that year
       const budget = await this.budgetRepository.findOne({
        where : {year : year}
      });
       // checking if the budget exists on that year 
       if (budget){
        if (operation == "add"){
          this.increment_budget(budget, orderMission);
        }
        else if (operation == "minus"){
          this.decrement_budget(budget, orderMission);
        }
        
        await this.budgetRepository.update(budget.id,budget);
      }
      // if the budget does not exist a new budget row is created 
      else {
        await this.budgetRepository.save({
          year : year,
          total : orderMission.budget
        });
      }
};


 increment_budget(budget : Budget , orderMission : OrderMission){
  budget.total+=orderMission.budget;
};

 decrement_budget(budget : Budget , orderMission : OrderMission){
  budget.total-=orderMission.budget;
};

*/
}

