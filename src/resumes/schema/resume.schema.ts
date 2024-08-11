import { Company } from "@/companies/schema/company.schema";
import { Job } from "@/jobs/schemas/job.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type ResumeDocument = HydratedDocument<Resume>;

export const STATUS_RESUME = {
  pending: "PENDING",
  approved: "APPROVED",
  reviewing: "REVIEWING",
  rejected: "REJECTED",
};

export enum statusEnum {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REVIEWING = "REVIEWING",
  REJECTED = "REJECTED",
}

export class historyResumClass {
  status: statusEnum;
  updatedAt: Date;
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId | string;
    email: string;
  };
}

@Schema({ timestamps: true })
export class Resume {
  @Prop()
  email: string;
  @Prop()
  userId: mongoose.Schema.Types.ObjectId;
  @Prop()
  url: string;
  @Prop()
  status: statusEnum;

  //Const Field

  @Prop()
  createAt: Date;

  @Prop()
  updateAt: Date;

  @Prop()
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;

  @Prop({ type: [mongoose.Types.ObjectId], ref: Company.name })
  companyId: Company[];

  @Prop({ type: [mongoose.Types.ObjectId], ref: Job.name })
  jobId: Job[];

  @Prop({ type: mongoose.Schema.Types.Array })
  history: historyResumClass[];

  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
  @Prop({ type: Object })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
}

export const ResumeSchema = SchemaFactory.createForClass(Resume);
