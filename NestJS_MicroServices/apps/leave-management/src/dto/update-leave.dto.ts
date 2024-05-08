import { CreateLeaveDto } from "./create-leave.dto";
import { PartialType } from "@nestjs/swagger";

export class UpdateLeaveDto extends PartialType(CreateLeaveDto){}