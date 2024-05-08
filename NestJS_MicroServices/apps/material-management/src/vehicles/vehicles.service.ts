import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Vehicle } from "./entities/vehicle.entity";
import { CreateVehicleDto } from "./dto/create-vehicle.dto";

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>
  ) {}

  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    const { nbPlate, brand, type, energy, indexKm } = createVehicleDto;

    // Check if the beneficiary exists

    const vehicle = this.vehicleRepository.create({
      nbPlate,
      brand,
      type,
      energy,
      indexKm,
    });

    return await this.vehicleRepository.save(vehicle);
  }

  async findAll(): Promise<Vehicle[]> {
    return await this.vehicleRepository.find();
  }

  async findOne(id: number): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id: id },
    });
    if (!vehicle) {
      throw new NotFoundException("Vehicle not found");
    }
    return vehicle;
  }

  async update(
    id: number,
    updateVehicleDto: Partial<CreateVehicleDto>
  ): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id: id },
    });
    if (!vehicle) {
      throw new NotFoundException("Vehicle not found");
    }

    // Update beneficiary if provided

    Object.assign(vehicle, updateVehicleDto);
    return await this.vehicleRepository.save(vehicle);
  }

  async remove(id: number): Promise<void> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id: id },
    });
    if (!vehicle) {
      throw new NotFoundException("Vehicle not found");
    }
    await this.vehicleRepository.remove(vehicle);
  }
}
