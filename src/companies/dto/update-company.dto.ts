import { OmitType, PartialType } from "@nestjs/mapped-types";
import { CreateCompanyDto } from "./create-Company.dto";

export class UpdateCompanyDto extends OmitType(CreateCompanyDto, []) {
  _id: string;
}
