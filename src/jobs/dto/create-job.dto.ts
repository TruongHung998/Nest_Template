import { Company } from "@/companies/schema/company.schema";
import { stringConst } from "@/constants/auth";
import { IsStartDateBeforeEndDate } from "@/decorator/customize";
import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  ValidateNested
} from "class-validator";

export class CreateJobDto {
  @IsNotEmpty({ message: stringConst.requireMessage("name") })
  name: string;

  @IsNotEmpty({ message: stringConst.requireMessage("skill") })
  @IsArray()
  @ArrayMinSize(1)
  skill: string[];

  @IsNotEmpty({ message: stringConst.requireMessage("location") })
  location: string;

  @IsNotEmpty({ message: stringConst.requireMessage("salary") })
  @IsNumber({}, { message: stringConst.requireNumberMessage("salary") })
  salary: number;

  @IsNotEmpty({ message: stringConst.requireMessage("quantity") })
  @IsNumber({}, { message: stringConst.requireNumberMessage("quantity") })
  quantity: number;

  @IsNotEmpty({ message: stringConst.requireMessage("level") })
  level: string;

  @IsNotEmpty({ message: stringConst.requireMessage("description") })
  description: string;

  @IsNotEmpty({ message: stringConst.requireMessage("startDate") })
  @IsStartDateBeforeEndDate("endDate", {
    message: "startDate must be before endDate",
  })
  @IsDate({ message: stringConst.requireDateMessage("startDate") })
  @Type(() => Date)
  startDate: Date;

  @IsNotEmpty({ message: stringConst.requireMessage("endDate") })
  @IsDate({ message: stringConst.requireDateMessage("endDate") })
  @Type(() => Date)
  endDate: Date;

  @IsNotEmpty({ message: stringConst.requireMessage("isActive") })
  isActive: boolean;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  @IsNotEmpty({ message: stringConst.requireMessage("company") })
  company: Company;
}
