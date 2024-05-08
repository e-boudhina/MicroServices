import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { join } from 'path';

import { Material } from 'apps/material-management/src/entities/material.entity';
import { Category } from 'apps/material-management/src/category/entities/category.entity';
import { Assignment } from 'apps/material-management/src/assignment/entities/assignment.entity';
import { Vehicle } from 'apps/material-management/src/vehicles/entities/vehicle.entity';
//import { User } from '../../../users/entities/user.entity';
import { CertificateManagement } from 'apps/material-management/src/certificate-management/entities/certificate-management.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.getOrThrow('MYSQL_HOST'),
        username: configService.getOrThrow('MYSQL_USERNAME'),
        //password: configService.getOrThrow('MYSQL_PASSWORD'),
        password: configService.getOrThrow('MYSQL_ROOT_PASSWORD'),
        port: configService.getOrThrow('MYSQL_PORT'),
        database: configService.getOrThrow('MYSQL_DATABASE'),
        autoLoadEntities: true,
        //Automaticly synchronize databases colums, if you change something here it automaticly updates the db
        synchronize: configService.getOrThrow('MYSQL_SYNCHRONIZE'),
        migrationsRun: true,
        entities: [
          Material,
          Category,
          Assignment,
          Vehicle,
          CertificateManagement,
        ],
        //migrations: ['/src/migration/**'],

        //dropSchema: configService.getOrThrow('MYSQL_dropSchema'),
        //entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
