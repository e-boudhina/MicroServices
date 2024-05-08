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
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";
import { CategoryService } from "./category.service";
import { Category } from "./entities/category.entity";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { Public } from "apps/auth/src/common/decorators/public.decorator";

@Controller("categories")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Public()
  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto
  ): Promise<Category> {
    try {
      return await this.categoryService.create(createCategoryDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException("Category already exists");
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException("Invalid input data");
      } else {
        throw new InternalServerErrorException("Failed to create category");
      }
    }
  }
  @Public()
  @Get()
  async findAll(): Promise<Category[]> {
    try {
      return await this.categoryService.findAll();
    } catch (error) {
      throw new InternalServerErrorException("Failed to fetch categories");
    }
  }
  @Public()
  @Get(":id")
  async findOne(@Param("id") id: string): Promise<Category> {
    try {
      return await this.categoryService.findOne(+id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      } else {
        throw new InternalServerErrorException("Failed to fetch category");
      }
    }
  }
  @Public()
  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ): Promise<Category> {
    try {
      return await this.categoryService.update(+id, updateCategoryDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException("Invalid input data");
      } else {
        throw new InternalServerErrorException("Failed to update category");
      }
    }
  }
  @Public()
  @Delete(":id")
  async remove(@Param("id") id: string): Promise<{ message: string }> {
    try {
      await this.categoryService.remove(+id);
      return { message: `Category with ID ${id} deleted successfully` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      } else {
        throw new InternalServerErrorException("Failed to delete category");
      }
    }
  }
}
