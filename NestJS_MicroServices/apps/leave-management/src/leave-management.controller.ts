import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { LeaveManagementService } from './leave-management.service';
import { CreateLeaveDto } from "./dto/create-leave.dto";
import { UpdateLeaveDto } from "./dto/update-leave.dto";

@Controller('leave')
export class LeaveManagementController {
  constructor(private readonly leaveManagementService: LeaveManagementService) {}

  @Get()
  findAll() {
    return this.leaveManagementService.findAll();
  }

  @Get('/:leave_id')
  findOne(@Param("leave_id") id: string){
    return this.leaveManagementService.findOne(+id);
  }

  @Post()
  async Create(@Body() createLeaveDto:CreateLeaveDto){
    return await this.leaveManagementService.create(createLeaveDto);
  }

  @Patch('/:leave_id')
  async update(@Param('leave_id') id: number , @Body() updateLeaveDto : UpdateLeaveDto){
    return await this.leaveManagementService.update(id , updateLeaveDto);
  }

  @Delete('/:leave_id')
  async delete(@Param('leave_id') id:number){
    return await this.leaveManagementService.remove(id);
  }

}
