import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { Assignment } from './entities/assignment.entity';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { DeleteResult } from 'typeorm';
import { Public } from 'apps/auth/src/common/decorators/public.decorator';

@Controller('assignments')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}
  @Public()
  @Get()
  async findAll(): Promise<Assignment[]> {
    try {
      return await this.assignmentService.findAll();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  @Public()
  @Get(':id')
  async findById(@Param('id') id: number): Promise<Assignment> {
    try {
      const assignment = await this.assignmentService.findById(id);
      if (!assignment) {
        throw new NotFoundException(`Assignment with id ${id} not found`);
      }
      return assignment;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  @Public()
  @Post()
  async create(
    @Body() assignmentData: CreateAssignmentDto,
  ): Promise<Assignment> {
    try {
      return await this.assignmentService.create(assignmentData);
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }
  @Public()
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() assignmentData: UpdateAssignmentDto,
  ): Promise<Assignment> {
    try {
      const assignment = await this.assignmentService.update(
        id,
        assignmentData,
      );
      if (!assignment) {
        throw new NotFoundException(`Assignment with id ${id} not found`);
      }
      return assignment;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  @Public()
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<string> {
    try {
      const result: DeleteResult = await this.assignmentService.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Assignment with ID ${id} not found`);
      }
      // If the deletion is successful without generating an error, return a success message
      return `Assignment with ID ${id} deleted successfully`;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // Autres méthodes de contrôleur pour la gestion des attributions
}
