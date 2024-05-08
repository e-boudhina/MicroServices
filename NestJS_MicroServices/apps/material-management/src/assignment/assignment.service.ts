import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { Assignment } from './entities/assignment.entity';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { DeleteResult } from 'typeorm';
import { User } from 'apps/auth/src/users/entities/user.entity'; // Import the User entity
import { Material } from '../entities/material.entity';

@Injectable()
export class AssignmentService {
  constructor(
    @InjectRepository(Assignment)
    private readonly assignmentRepository: Repository<Assignment>,
    @InjectRepository(User) // Inject the User repository
    private readonly userRepository: Repository<User>,
    @InjectRepository(Material) // Inject the Material repository
    private readonly materialRepository: Repository<Material>,
  ) {}

  async findAll(): Promise<Assignment[]> {
    return this.assignmentRepository.find();
  }

  async findById(id: number): Promise<Assignment> {
    return this.assignmentRepository.findOne({ where: { id } });
  }

  async create(assignmentData: CreateAssignmentDto): Promise<Assignment> {
    const user = await this.userRepository.findOne({
      where: { id: assignmentData.userId },
    }); // Check if user exists
    if (!user) {
      throw new NotFoundException(
        `User with ID ${assignmentData.userId} not found`,
      );
    }

    const material = await this.materialRepository.findOne({
      where: { id: assignmentData.materialId },
    }); // Check if material exists
    if (!material) {
      throw new NotFoundException(
        `Material with ID ${assignmentData.materialId} not found`,
      );
    }

    return this.assignmentRepository.save(assignmentData);
  }

  async update(
    id: number,
    assignmentData: UpdateAssignmentDto,
  ): Promise<Assignment> {
    await this.assignmentRepository.update(id, assignmentData);
    return this.assignmentRepository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.assignmentRepository.delete(id);
  }

  // Other service methods for assignment management
}
