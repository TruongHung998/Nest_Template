import { CompaniesService } from "@/companies/companies.service";
import { JobsService } from "@/jobs/jobs.service";
import { IUser } from "@/user/users.interface";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import { CreateResumeDto } from "./dto/create-resume.dto";
import { UpdateResumeDto } from "./dto/update-resume.dto";
import { Resume, ResumeDocument, STATUS_RESUME } from "./schema/resume.schema";

@Injectable()
export class ResumesService {
  constructor(
    @InjectModel(Resume.name)
    private resumeModel: SoftDeleteModel<ResumeDocument>,
    private companiesService: CompaniesService,
    private jobsService: JobsService
  ) {}

  async create(createResumeDto: CreateResumeDto, user: IUser) {
    const _company = await this.companiesService.findOne(
      createResumeDto.companyId
    );
    if (!_company) {
      throw new BadRequestException("Công ty không tồn tại");
    }
    const _job = await this.jobsService.findOne(createResumeDto.jobId);
    if (!_job) {
      throw new BadRequestException("Công ty không tồn tại");
    }
    const _create = await this.resumeModel.create({
      ...createResumeDto,
      status: STATUS_RESUME.reviewing,
      history: [
        {
          status: STATUS_RESUME.reviewing,
          updatedAt: new Date(),
          updatedBy: {
            _id: user._id,
            mail: user.email,
          },
        },
      ],
      createdBy: {
        _id: user._id,
        mail: user.email,
      },
    });
    return _create;
  }

  findAll() {
    return `This action returns all resumes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} resume`;
  }

  update(id: number, updateResumeDto: UpdateResumeDto) {
    return `This action updates a #${id} resume`;
  }

  remove(id: number) {
    return `This action removes a #${id} resume`;
  }
}
