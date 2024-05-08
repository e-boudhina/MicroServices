import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Public } from "../../../auth/src/common/decorators/public.decorator";



@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}


 

  @Public()
  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  };

  @Public()
  @Get()
  findAll() {
    return this.tasksService.findAll();
  };
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    try{
      return this.tasksService.findOne(+id);
    }
    catch(error){
      throw new NotFoundException();
    }
    
  };
  @Public()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(+id, updateTaskDto);
  };
  @Public()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  };





}
