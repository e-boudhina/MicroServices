import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "./entities/category.entity";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      const { name } = createCategoryDto;

      // Validate input
      if (!name) {
        throw new BadRequestException("Name is required");
      }

      // Check if category with the same name already exists
      const existingCategory = await this.categoryRepository.findOne({
        where: { name },
      });
      if (existingCategory) {
        throw new ConflictException(
          "Category with the same name already exists"
        );
      }

      const category = this.categoryRepository.create(createCategoryDto);
      return await this.categoryRepository.save(category);
    } catch (error) {
      throw new ConflictException("Category creation failed");
    }
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto
  ): Promise<Category> {
    try {
      const { name } = updateCategoryDto;

      // Validate input
      if (!name) {
        throw new BadRequestException("Name is required");
      }

      const category = await this.findOne(id);
      const updatedCategory = { ...category, ...updateCategoryDto };
      return await this.categoryRepository.save(updatedCategory);
    } catch (error) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.categoryRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }
    } catch (error) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }
}
