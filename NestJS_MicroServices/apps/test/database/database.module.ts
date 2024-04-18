
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { join } from 'path';
//import { User } from '../../../users/entities/user.entity';

@Module({
    imports: [
      TypeOrmModule.forRootAsync({
         useFactory: (configService: ConfigService) => ({
          type: 'mysql',
          host: 'localhost',
          username: 'root',
          //password: configService.getOrThrow('MYSQL_PASSWORD'),
          password: 'axelites_pwd',
          port: 3307,
          database: 'mytestdatabase',
          autoLoadEntities: true,
          //Automaticly synchronize databases colums, if you change something here it automaticly updates the db
          synchronize: true,
          migrationsRun: true,
          //entities: [User],
          //migrations: ['/src/migration/**'],
         
          //dropSchema: configService.getOrThrow('MYSQL_dropSchema'),
          //entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      
        }),
        inject: [ConfigService],
      }),
    ],
  })
  export class DatabaseModule {} 
  