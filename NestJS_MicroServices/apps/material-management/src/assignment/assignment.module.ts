import { Module } from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { AssignmentController } from './assignment.controller';
import { Assignment } from './entities/assignment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Material } from '../entities/material.entity';
import { User } from 'apps/auth/src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Assignment, Material, User])],
  controllers: [AssignmentController],
  providers: [AssignmentService],
})
export class AssignmentModule {}
