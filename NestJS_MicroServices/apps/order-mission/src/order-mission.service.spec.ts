import { Test, TestingModule } from "@nestjs/testing";
import { OrderMissionService } from "./order-mission.service";

describe("OrderMissionService", () => {
  let service: OrderMissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderMissionService],
    }).compile();

    service = module.get<OrderMissionService>(OrderMissionService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
