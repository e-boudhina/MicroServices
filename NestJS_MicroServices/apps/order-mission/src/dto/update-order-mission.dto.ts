import { PartialType } from "@nestjs/mapped-types";
import { CreateOrderMissionDto } from "./create-order-mission.dto";

export class UpdateOrderMissionDto extends PartialType(CreateOrderMissionDto) {}
