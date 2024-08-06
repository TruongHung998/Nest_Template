import { CompaniesModule } from "@/companies/companies.module";
import { JobsModule } from "@/jobs/jobs.module";
import { Module } from "@nestjs/common";
import { ResumesController } from "./resumes.controller";
import { ResumesService } from "./resumes.service";
import { Resume, ResumeSchema } from "./schema/resume.schema";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    CompaniesModule,
    JobsModule,
    MongooseModule.forFeature([{ name: Resume.name, schema: ResumeSchema }]),
  ],
  controllers: [ResumesController],
  providers: [ResumesService],
})
export class ResumesModule {}
