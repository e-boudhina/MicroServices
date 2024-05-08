import { Module } from '@nestjs/common';
import { MaterialManagementService } from './material-management.service';
import { MaterialManagementController } from './material-management.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category/entities/category.entity';
//import { Inventory } from 'src/inventory/entities/inventory.entity';
//import { Mission } from './entities/mission.entity';
import { Material } from './entities/material.entity';
import { Assignment } from './assignment/entities/assignment.entity';
//import { OrderMission } from '../order-mission/entities/order-mission.entity';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../common/database/database.module';
import { RmqModule } from '@app/common';
import { Vehicle } from './vehicles/entities/vehicle.entity';
import { CategoryModule } from './category/category.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { AssignmentModule } from './assignment/assignment.module';
import { CertificateManagement } from './certificate-management/entities/certificate-management.entity';
import { CertificateManagementModule } from './certificate-management/certificate-management.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Category,
      //Inventory,
      //Mission,
      Material,
      Vehicle,
      Assignment,
      //OrderMission,
      CertificateManagement,
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/material-management/.env',
    }),
    DatabaseModule,
    CategoryModule,
    VehiclesModule,
    CertificateManagementModule,

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
      name: 'AUTH',
    }),
  ],
  controllers: [MaterialManagementController],
  providers: [MaterialManagementService],
})
export class MaterialManagementModule {}
