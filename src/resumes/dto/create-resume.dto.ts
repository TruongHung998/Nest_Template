import { Company } from "@/companies/schema/company.schema";
import { stringConst } from "@/constants/auth";
import { IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateResumeDto {
  @IsNotEmpty({ message: stringConst.requireMessage("name") })
  url: string;

  @IsNotEmpty({ message: stringConst.requireMessage("companyId") })
  @IsMongoId()
  companyId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: stringConst.requireMessage("jobId") })
  @IsMongoId()
  jobId: mongoose.Schema.Types.ObjectId;
}
