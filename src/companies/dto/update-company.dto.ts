import { OmitType, PartialType } from "@nestjs/mapped-types";
import { CreateCompanyDto } from "./create-company.dto";
export class UpdateCompanyDto extends OmitType(CreateCompanyDto, []) {
  _id: string;
}
