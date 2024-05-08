import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

import { Leave } from "./entities/leave.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateLeaveDto } from "./dto/create-leave.dto";
import { UpdateLeaveDto } from "./dto/update-leave.dto";

@Injectable()
export class LeaveManagementService {
  constructor( @InjectRepository(Leave) private readonly leaveRepository: Repository<Leave>) {}
  async create (createLeaveDto : CreateLeaveDto) {

    const leave  = new Leave(createLeaveDto);
    if (new Date(leave.end_date) < new Date(leave.start_date)){
      throw new BadRequestException("start date should be lower than end date");
    }
    leave.start_date = new Date(createLeaveDto.start_date);
    leave.end_date = new Date(createLeaveDto.end_date);

    return await this.leaveRepository.save(leave);
  }

  async findAll(){

    return await this.leaveRepository.find();

  }

  async findOne(id: number){
    const leave =  this.leaveRepository.findOne({
      where : {id : id}
    });

    if (!leave) throw new NotFoundException("this id was not found");

    return leave ;
  }

  async update(id :number , updateLeaveDto : UpdateLeaveDto ){
    const leave = await this.findOne(id);
    if (updateLeaveDto.start_date && updateLeaveDto.end_date){
      if (new Date(updateLeaveDto.start_date) > new Date(updateLeaveDto.end_date) ) {
        throw new BadRequestException("start date should not be higher than end date");
      }
    }
    else if (updateLeaveDto.start_date){
      if (new Date(updateLeaveDto.start_date) > new Date(leave.end_date) ){
        throw new BadRequestException("start date should not be higher than end date");
      }
    }
    else if (updateLeaveDto.end_date){
      if (new Date(updateLeaveDto.end_date) < new Date(leave.start_date)){
        throw new BadRequestException("end date should not be lower than end date");
      }
    }

    await this.leaveRepository.update(id ,updateLeaveDto);

    return await this.findOne(id);

  }
  async remove(id:number){
    const leave = await this.findOne(id);

    if (leave){
      await this.leaveRepository.delete(id);
      return {message : "leave demand successfully deleted " , id}
    }

  };

  getHello(): string {
    return 'Hello World!';
  }
}
