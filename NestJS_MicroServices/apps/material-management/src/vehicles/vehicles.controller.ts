import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { VehicleService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Public } from 'apps/auth/src/common/decorators/public.decorator';

@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}
  @Public()
  @Post()
  async create(@Body() createVehicleDto: CreateVehicleDto) {
    try {
      return await this.vehicleService.create(createVehicleDto);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create vehicle');
    }
  }
  @Public()
  @Get()
  async findAll() {
    try {
      return await this.vehicleService.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Failed to find vehicles');
    }
  }
  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.vehicleService.findOne(+id);
    } catch (error) {
      throw new NotFoundException('Vehicle not found');
    }
  }
  @Public()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ) {
    try {
      return await this.vehicleService.update(+id, updateVehicleDto);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update vehicle');
    }
  }
  @Public()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.vehicleService.remove(+id);
    } catch (error) {
      throw new InternalServerErrorException('Failed to remove vehicle');
    }
  }
}
