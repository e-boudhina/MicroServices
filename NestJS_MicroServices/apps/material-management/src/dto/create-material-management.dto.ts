import { IsNotEmpty, IsString, IsOptional } from "class-validator";
import { Category } from "../category/entities/category.entity";
export class CreateMaterialManagementDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  categoryId: number;

  // Add any other necessary fields
}
