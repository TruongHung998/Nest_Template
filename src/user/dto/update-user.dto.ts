import { OmitType, PartialType } from "@nestjs/mapped-types";
import { RegisterUserDto } from "./create-user.dto";

export class UpdateUserDto extends OmitType(RegisterUserDto, [
  "password" as const,
]) {
  _id: string;
}
