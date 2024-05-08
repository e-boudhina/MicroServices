import { Test, TestingModule } from '@nestjs/testing';
import { CertificateManagementController } from './certificate-management.controller';
import { CertificateManagementService } from './certificate-management.service';

describe('CertificateManagementController', () => {
  let controller: CertificateManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CertificateManagementController],
      providers: [CertificateManagementService],
    }).compile();

    controller = module.get<CertificateManagementController>(CertificateManagementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
