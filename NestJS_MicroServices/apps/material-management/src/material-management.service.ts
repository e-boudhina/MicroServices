import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Material } from "./entities/material.entity";
import { CreateMaterialManagementDto } from "./dto/create-material-management.dto";
import { UpdateMaterialManagementDto } from "./dto/update-material-management.dto";
import { Category } from "./category/entities/category.entity";

@Injectable()
export class MaterialManagementService {
  constructor(
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

  async create(
    createMaterialDto: CreateMaterialManagementDto
  ): Promise<Material> {
    const { name, description, categoryId, status, quantity } =
      createMaterialDto;

    // Validate input
    if (!name || !description || !categoryId || !status || !quantity) {
      throw new BadRequestException(
        "Name, description, categoryId, status, and quantity are required"
      );
    }

    // Check if material with the same name already exists
    const existingMaterial = await this.materialRepository.findOne({
      where: { name },
    });
    if (existingMaterial) {
      throw new ConflictException("Material with the same name already exists");
    }

    // Check if categoryId exists
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    // Create the material
    const material = this.materialRepository.create(createMaterialDto);
    material.category = category;
    return await this.materialRepository.save(material);
  }

  async findAll(): Promise<Material[]> {
    return await this.materialRepository.find({ relations: ["category"] });
  }

  async findOne(id: number): Promise<Material> {
    const material = await this.materialRepository.findOne({ where: { id } });
    if (!material) {
      throw new NotFoundException(`Material with ID ${id} not found`);
    }
    return material;
  }

  async update(
    id: number,
    updateMaterialDto: UpdateMaterialManagementDto
  ): Promise<Material> {
    try {
      const { name, description, status, quantity } = updateMaterialDto;

      // Validate input
      /*if (!name || !description || !status || !quantity) {
        throw new BadRequestException(
          "Name, description, status, and quantity are required"
        );
      }*/

      const material = await this.findOne(id);
      const updatedMaterial = { ...material, ...updateMaterialDto };
      return await this.materialRepository.save(updatedMaterial);
    } catch (error) {
      console.log(error);
      throw new NotFoundException(`Material with ID ${id} not found`);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.materialRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Material with ID ${id} not found`);
      }
    } catch (error) {
      throw new NotFoundException(`Material with ID ${id} not found`);
    }
  }
}
