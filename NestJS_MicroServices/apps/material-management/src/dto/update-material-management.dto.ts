import { PartialType } from '@nestjs/mapped-types';
import { CreateMaterialManagementDto } from './create-material-management.dto';

export class UpdateMaterialManagementDto extends PartialType(CreateMaterialManagementDto) {}
