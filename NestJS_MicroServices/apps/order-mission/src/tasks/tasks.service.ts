import {BadRequestException, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import {OrderMission} from "../entities/order-mission.entity";


@Injectable()
export class TasksService {

  constructor(
    @InjectRepository(Task)
    private readonly taskRepository : Repository <Task>,
    @InjectRepository(OrderMission)
  private readonly  orderMissionRepository : Repository <OrderMission>
  ){}

  async completionLevel (order_mission_id: number) : Promise<number>{
    const order_mission = await this.orderMissionRepository.findOne({where : {
      id : order_mission_id
      }});
    if (! order_mission){
      return null;
    }

    const tasks = await this.taskRepository
        .createQueryBuilder("task")
        .innerJoinAndSelect("task.order_mission_id", "order_mission")
        .where("order_mission.id = :orderId", { orderId: order_mission_id })
        .getMany();

    if (tasks.length != 0 ){
      // counting the total number of tasks related to orderMission
      const totalTasks =tasks.length;
      // filtering the tasks based on status "completed"
      const task = tasks.filter(task => task.status == "completed");
      // counting the number of completed tasks
      const completedTasks = task.length;
     //console.log(completedTasks);
      // returning the rounded pourcentage.
      return Math.round((completedTasks*100) / totalTasks);
    }
    else {
      throw new NotFoundException('no task found !');
    }
  }

  async create(createTaskDto: CreateTaskDto) {

      if (! createTaskDto.order_mission_id){
        throw new BadRequestException("order mission is required");
      }

      const order_mission = await this.orderMissionRepository.findOne({
        where : {id : createTaskDto.order_mission_id}
      });
      if (!order_mission) throw new NotFoundException('order mission not found !');
      else{
        const task = new Task(createTaskDto);
        const result = await this.taskRepository.save(task);
        return result;
      }
  }

   async findAll() : Promise <Task []> {
    return await this.taskRepository.find();
  }

  async findOne(id: number): Promise <Task> {
    const result = await this.taskRepository.findOne({
      where : { id :id}
    })
    if (!result) throw new NotFoundException ('this task does not exist');
    return result;

  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    try{
      const task = await this.taskRepository.findOne({
        where:{id : id}
      });

      if (! task) {
        throw new NotFoundException("task not found");
      }
      else {
        const result = await this.taskRepository.update(id ,updateTaskDto); 
        return result; 
      } 
      
    }
    catch (error){
      throw new InternalServerErrorException("task update failed !");
    }
  }

  async remove(id: number) {
      const task = await this.taskRepository.findOne({
        where: {id :id}
      });

      if (! task){
       throw new NotFoundException('this task not found');
      }
      const result = await this.taskRepository.delete(id);
      return {message : 'task deleted'};
  }
}
