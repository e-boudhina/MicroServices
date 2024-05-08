import { PartialType } from '@nestjs/mapped-types';
import { CreateCertificateManagementDto } from './create-certificate-management.dto';

export class UpdateCertificateManagementDto extends PartialType(CreateCertificateManagementDto) {}
