import { CompaniesService } from "@/companies/companies.service";
import { JobsService } from "@/jobs/jobs.service";
import { IUser } from "@/user/users.interface";
import { BadRequestException, Injectable, Query } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import { CreateResumeDto } from "./dto/create-resume.dto";
import { UpdateResumeDto } from "./dto/update-resume.dto";
import {
  Resume,
  ResumeDocument,
  STATUS_RESUME,
  statusEnum,
} from "./schema/resume.schema";
import aqp from "api-query-params";
import { ObjectId } from "mongoose";

@Injectable()
export class ResumesService {
  constructor(
    @InjectModel(Resume.name)
    private resumeModel: SoftDeleteModel<ResumeDocument>,
    private companiesService: CompaniesService,
    private jobsService: JobsService
  ) {}
  checkMatch(id) {
    return id.match(/^[0-9a-fA-F]{24}$/);
  }

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
      status: statusEnum.REVIEWING,
      history: [
        {
          status: STATUS_RESUME.reviewing,
          updatedAt: new Date(),
          updatedBy: {
            _id: user._id,
            email: user.email,
          },
        },
      ],
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return _create;
  }

  async findAll(@Query() qs: string) {
    try {
      const { filter, projection, population, limit } = aqp(qs);
      const { page } = filter;
      let offset = (+page - 1) * +limit;
      let defaultLimit = +limit ? +limit : 10;
      delete filter.page;
      const totalItems = (await this.resumeModel.find(filter)).length;
      const totalPages = Math.ceil(totalItems / defaultLimit);
      const result = await this.resumeModel
        .find(filter)
        .skip(offset)
        .limit(defaultLimit)
        // @ts-ignore: Unreachable code error .sort(sort)
        .populate(population)
        .exec();
      return {
        length: result.length,
        totalPages,
        result,
      };
    } catch (e) {
      return e;
    }
  }

  findOne(id: ObjectId | string) {
    if (this.checkMatch(id)) {
      const _find = this.resumeModel.findById(id);
      return _find;
    } else {
      return {
        message: "Không tìm thấy người dùng",
      };
    }
  }

  async update(id: string, updateResumeDto: UpdateResumeDto, user: IUser) {
    try {
      if (this.checkMatch(id)) {
        const _find = await this.resumeModel.findById(id);
        if (_find) {
          const _history = _find.history;
          _history.push({
            status: updateResumeDto.status,
            updatedAt: new Date(),
            updatedBy: {
              _id: user._id,
              email: user.email,
            },
          });
          return await this.resumeModel.updateOne(
            { _id: id },
            {
              ...updateResumeDto,
              history: _history,
              updatedBy: {
                _id: user._id,
                email: user.email,
              },
            }
          );
        } else {
          return {
            message: "Không tìm thấy",
          };
        }
      } else {
        return {
          message: "Không tìm thấy",
        };
      }
    } catch (e) {
      return {
        message: "Không tìm thấy",
      };
    }
  }

  async remove(id: string, user: IUser) {
    try {
      if (this.checkMatch(id)) {
        await this.resumeModel.softDelete({ _id: id });
        await this.resumeModel.updateOne(
          { _id: id },
          {
            deletedBy: {
              _id: user._id,
              mail: user.email,
            },
          }
        );
        return {
          success: true,
        };
      } else {
        return {
          message: "Không tìm thấy công ty",
        };
      }
    } catch (e) {
      return e;
    }
  }

  findByUser(id: string) {
    const _find = this.resumeModel
      .find({ "createdBy._id": id })
      .sort("-createdAt")
      .populate([
        {
          path: "companyId",
          select: { name: 1 },
        },
        {
          path: "jobId",
          select: { name: 1 },
        },
      ]);
    return _find;
  }
}
