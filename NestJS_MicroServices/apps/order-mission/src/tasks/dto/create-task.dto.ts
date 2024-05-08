import { OrderMission } from "../../entities/order-mission.entity";
import {IsNotEmpty} from "class-validator";

export class CreateTaskDto {
    @IsNotEmpty()
    name : string;

    status : string;

    order_mission_id: number;
}
