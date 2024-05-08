import { Module } from "@nestjs/common";
import { OrderMissionService } from "./order-mission.service";
import { OrderMissionController } from "./order-mission.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderMission } from "./entities/order-mission.entity";
import { TasksService } from "./tasks/tasks.service";
import { Task } from "./tasks/entities/task.entity";
import { ConfigModule } from "@nestjs/config";
import { RmqModule } from "@app/common";

import { DatabaseModule } from "./common/database/database.module";
import { Users } from "./users/entities/users.entity";
import { TasksModule } from "./tasks/tasks.module";


@Module({
  imports: [TypeOrmModule.forFeature([OrderMission,Task,Users]),
    ConfigModule.forRoot({isGlobal: true, envFilePath: './apps/order-mission/.env'}),
    DatabaseModule,
    TasksModule,
    /*
    ClientsModule.register([
      {
        name:'AUTH_SERVICE',
        transport:Transport.TCP,
        options:{
          host:'127.0.0.1',
          port:4200
        }
      }
    ]), */
    RmqModule.register({
      name: 'AUTH'
    }),
  ],


  controllers: [OrderMissionController],
  providers: [OrderMissionService, TasksService],
})
export class OrderMissionModule {}
