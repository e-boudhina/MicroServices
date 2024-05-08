import { Module } from '@nestjs/common';
import { CertificateManagementService } from './certificate-management.service';
import { CertificateManagementController } from './certificate-management.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CertificateManagement } from './entities/certificate-management.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CertificateManagement]), // Provide the repository
    // Other modules that might be imported
  ],
  controllers: [CertificateManagementController],
  providers: [CertificateManagementService],
})
export class CertificateManagementModule {}
