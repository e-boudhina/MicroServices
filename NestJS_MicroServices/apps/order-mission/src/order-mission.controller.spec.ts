import { Test, TestingModule } from "@nestjs/testing";
import { OrderMissionController } from "./order-mission.controller";
import { OrderMissionService } from "./order-mission.service";

describe("OrderMissionController", () => {
  let controller: OrderMissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderMissionController],
      providers: [OrderMissionService],
    }).compile();

    controller = module.get<OrderMissionController>(OrderMissionController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
