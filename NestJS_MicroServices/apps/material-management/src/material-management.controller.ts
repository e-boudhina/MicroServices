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
} from "@nestjs/common";
import { MaterialManagementService } from "./material-management.service";
import { Material } from "./entities/material.entity";
import { CreateMaterialManagementDto } from "./dto/create-material-management.dto";
import { UpdateMaterialManagementDto } from "./dto/update-material-management.dto";
import { Public } from "apps/auth/src/common/decorators/public.decorator";

@Controller("materials")
export class MaterialManagementController {
  constructor(private readonly materialService: MaterialManagementService) {}

  @Public()
  @Post()
  async create(
    @Body() createMaterialDto: CreateMaterialManagementDto
  ): Promise<{ message: string; data: Material }> {
    try {
      const createdMaterial =
        await this.materialService.create(createMaterialDto);
      return {
        message: "Material created successfully",
        data: createdMaterial,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Public()
  @Get()
  async findAll(): Promise<{ message: string; data: Material[] }> {
    try {
      const materials = await this.materialService.findAll();
      return { message: "Materials retrieved successfully", data: materials };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Public()
  @Get(":id")
  async findOne(
    @Param("id") id: string
  ): Promise<{ message: string; data: Material }> {
    try {
      const material = await this.materialService.findOne(+id);
      if (!material) {
        throw new NotFoundException(`Material with id ${id} not found`);
      }
      return { message: "Material retrieved successfully", data: material };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Public()
  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() updateMaterialDto: UpdateMaterialManagementDto
  ): Promise<{ message: string; data: Material }> {
    try {
      const material = await this.materialService.update(
        +id,
        updateMaterialDto
      );
      if (!material) {
        throw new NotFoundException(`Material with id ${id} not found`);
      }
      return { message: "Material updated successfully", data: material };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Public()
  @Delete(":id")
  async remove(@Param("id") id: string): Promise<{ message: string }> {
    try {
      await this.materialService.remove(+id);
      return { message: `Material with ID ${id} deleted successfully` };
    } catch (error) {
      throw new NotFoundException(`Material with ID ${id} not found`);
    }
  }
}
