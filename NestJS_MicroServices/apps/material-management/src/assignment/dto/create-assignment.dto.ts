import { IsNotEmpty, IsNumber, IsOptional, IsDate } from "class-validator";

export class CreateAssignmentDto {
  @IsNotEmpty()
  @IsNumber()
  materialId: number;

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsOptional()
  returnDate: Date;
}
