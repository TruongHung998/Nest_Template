import { Prop } from "@nestjs/mongoose";
import { statusEnum } from "../schema/resume.schema";
import { IsEnum } from "class-validator";

export class UpdateResumeDto {
  @Prop({ type: String, enum: statusEnum, default: statusEnum.REVIEWING })
  @IsEnum(statusEnum)
  status: statusEnum;
}
