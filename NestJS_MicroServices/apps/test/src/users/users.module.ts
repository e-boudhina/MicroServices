import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
//import { OrderMission } from 'src/order-mission/entities/order-mission.entity';


@Module({
  //WHat does for feature mean?
  //imports: [TypeOrmModule.forFeature([User, OrderMission, Role])],
  imports: [
    TypeOrmModule.forFeature([User]),
 
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
