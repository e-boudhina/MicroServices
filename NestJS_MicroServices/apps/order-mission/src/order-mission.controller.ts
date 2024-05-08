import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  InternalServerErrorException, NotFoundException, Inject
} from "@nestjs/common";
import { OrderMissionService } from "./order-mission.service";
import { CreateOrderMissionDto } from "./dto/create-order-mission.dto";
import { UpdateOrderMissionDto } from "./dto/update-order-mission.dto";
import { TasksService } from "./tasks/tasks.service";
import { ClientProxy, MessagePattern } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";
import { Public } from "./common/decorators/public.decorators";

@Controller("order-mission")
export class OrderMissionController {
  constructor(private readonly orderMissionService: OrderMissionService , private readonly tasksService: TasksService ,  @Inject('AUTH') private readonly AuthService: ClientProxy) {}


  @Get('/:mission_id/tasks')
  async getTasksByMission(@Param ("mission_id") mission_id:number){
    try{
      return await this.orderMissionService.getTasksByMissions(mission_id);
    } catch (error) {
      throw new InternalServerErrorException('error getting the tasks');
    }
  }

  @Post('addToMission/:mission_id/:user_id')
  async addUserToMission(@Param ("mission_id") mission_id :number , @Param("user_id") user_id : number){

      return await this.orderMissionService.addUserToMission(mission_id,user_id);

  }



  @Delete('deleteFromMission/:mission_id/:user_id')
  async deleteUserFromMission(@Param ("mission_id") mission_id :number , @Param("user_id") user_id : number){

      return await this.orderMissionService.deleteUserFromMission(mission_id,user_id);

  }

  @Delete('orders/:mission_id')
  async deleteOrders(@Param("mission_id") mission_id : number){
    return await this.orderMissionService.deleteOrders(mission_id);
  }

  @Get(':id/employees')
 async  UsersByMissions (@Param("id") mission_id :number){

        return await this.orderMissionService.getUsersByMissions(mission_id);

  }


@Get(':id/completion')
async completionLevel(@Param("id") id: number){
  return await this.tasksService.completionLevel(+id);
};

  @Post()
  async create(@Body() createOrderMissionDto: CreateOrderMissionDto) {
    try {
      /*
      const pattern = { cmd: 'get_user_by_id' };

      const users =  await lastValueFrom( this.AuthService.send(pattern, createOrderMissionDto.users));
      if (users.message) throw new NotFoundException('the user with this id does not exists');
      */
      //executing insert query
      const exec_Result = await this.orderMissionService.create(
        createOrderMissionDto,
      );

    } catch (error) {
      return { error : error}
    }
  };


  @Get('/availability')
  availability(){
    try{
      return  this.orderMissionService.currentAvailableEmployee();
    } catch(error){
      console.log(error);
    }

  };


  @Get()
  findAll() {
    try{
      return this.orderMissionService.findAll();
    }
    catch (error){
      throw  new InternalServerErrorException("no data found");
    }

  };

  @Get('/:mission_id')
  findOne(@Param("mission_id") id: string) {
    try{
      return this.orderMissionService.findOne(+id);
    }
    catch (error) {
      throw new InternalServerErrorException("order mission not found !");
    }

  };


  @Patch("/:mission_id")
  update( @Param('mission_id') id :number , @Body() updateOrderMissionDto : UpdateOrderMissionDto
  ) {
    try {
      return this.orderMissionService.update(id, updateOrderMissionDto);
    }

    catch(error){
      throw new InternalServerErrorException("order mission update failed !");
    }
    
  };

  @Delete('/:mission_id')
  async remove(@Param("mission_id") id: string) {
    return this.orderMissionService.remove(+id);
  };





}
