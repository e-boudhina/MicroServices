// create-vehicle.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsInt,
  IsOptional,
} from "class-validator";

export class CreateVehicleDto {
  @IsNotEmpty()
  @IsString()
  nbPlate: string;

  @IsNotEmpty()
  @IsString()
  brand: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  energy: string;

  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  indexKm: number;
}
