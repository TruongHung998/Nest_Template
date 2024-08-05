import { stringConst } from "@/constants/auth";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateJobDto {
  @IsNotEmpty({ message: stringConst.requireMessage })
  name: string;

  @IsNotEmpty({ message: stringConst.requireMessage })
  skill: string;

  @IsNotEmpty({ message: stringConst.requireMessage })
  location: string;

  @IsNotEmpty({ message: stringConst.requireMessage })
  salary: string;

  @IsNotEmpty({ message: stringConst.requireMessage })
  @IsNumber(null, { message: stringConst.requireMessage })
  quantity: number;

  @IsNotEmpty({ message: stringConst.requireMessage })
  level: string;

  @IsNotEmpty({ message: stringConst.requireMessage })
  description: string;

  @IsNotEmpty({ message: stringConst.requireMessage })
  startDate: Date;

  @IsNotEmpty({ message: stringConst.requireMessage })
  endDate: Date;

  @IsNotEmpty({ message: stringConst.requireMessage })
  isActive: boolean;
}
