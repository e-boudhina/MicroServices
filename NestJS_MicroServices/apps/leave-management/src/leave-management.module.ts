import { Module } from '@nestjs/common';
import { LeaveManagementController } from './leave-management.controller';
import { LeaveManagementService } from './leave-management.service';
import { RmqModule } from "@app/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Leave } from "./entities/leave.entity";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./common/database.module";


@Module({
  imports: [ TypeOrmModule.forFeature([Leave]),
    ConfigModule.forRoot({isGlobal: true, envFilePath: './apps/leave-management/.env'}),
    DatabaseModule,
    RmqModule.register({
      name: 'AUTH'
    }),
  ],
  controllers: [LeaveManagementController],
  providers: [LeaveManagementService],
})
export class LeaveManagementModule {}
