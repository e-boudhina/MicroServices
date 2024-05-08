import { Test, TestingModule } from '@nestjs/testing';
import { CertificateManagementService } from './certificate-management.service';

describe('CertificateManagementService', () => {
  let service: CertificateManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CertificateManagementService],
    }).compile();

    service = module.get<CertificateManagementService>(CertificateManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
