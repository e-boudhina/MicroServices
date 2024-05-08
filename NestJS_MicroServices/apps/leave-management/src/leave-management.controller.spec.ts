import { Test, TestingModule } from '@nestjs/testing';
import { LeaveManagementController } from './leave-management.controller';
import { LeaveManagementService } from './leave-management.service';

describe('LeaveManagementController', () => {
  let leaveManagementController: LeaveManagementController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [LeaveManagementController],
      providers: [LeaveManagementService],
    }).compile();

    leaveManagementController = app.get<LeaveManagementController>(LeaveManagementController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(leaveManagementController.getHello()).toBe('Hello World!');
    });
  });
});
