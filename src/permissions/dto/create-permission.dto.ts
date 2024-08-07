import { stringConst } from "@/constants/auth";
import { IsNotEmpty } from "class-validator";

export class CreatePermissionDto {
  @IsNotEmpty({ message: stringConst.requireMessage("name") })
  name: string;

  @IsNotEmpty({ message: stringConst.requireMessage("apiPath") })
  apiPath: string;

  @IsNotEmpty({ message: stringConst.requireMessage("method") })
  method: string;

  @IsNotEmpty({ message: stringConst.requireMessage("module") })
  module: string;
}
