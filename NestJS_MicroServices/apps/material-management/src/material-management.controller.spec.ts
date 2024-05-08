import { Test, TestingModule } from '@nestjs/testing';
import { MaterialManagementController } from './material-management.controller';
import { MaterialManagementService } from './material-management.service';

describe('MaterialManagementController', () => {
  let controller: MaterialManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaterialManagementController],
      providers: [MaterialManagementService],
    }).compile();

    controller = module.get<MaterialManagementController>(
      MaterialManagementController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
