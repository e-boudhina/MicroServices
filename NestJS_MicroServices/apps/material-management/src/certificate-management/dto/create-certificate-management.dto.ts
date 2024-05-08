// create-certificate-management.dto.ts
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateCertificateManagementDto {
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @IsDateString()
  @IsNotEmpty()
  endDate: Date;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  cinNumber: string;

  @IsString()
  @IsNotEmpty()
  additionalInfo: string;

  @IsString()
  @IsNotEmpty()
  position: string;

  @IsString()
  @IsNotEmpty()
  status: string;
}
