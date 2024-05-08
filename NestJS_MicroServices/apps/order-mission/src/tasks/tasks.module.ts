import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './entities/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import {OrderMission} from "../entities/order-mission.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Task ,OrderMission])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
