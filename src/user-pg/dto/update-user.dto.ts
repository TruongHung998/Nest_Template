import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { IsNotEmpty, IsUUID } from "class-validator";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsUUID()
  @IsNotEmpty({ message: "ID must not be empty" })
  id: string;
}
