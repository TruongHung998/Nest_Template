import { BadRequestException, Injectable, Query } from "@nestjs/common";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { IUser } from "@/user/users.interface";
import aqp from "api-query-params";
import { CreateJobDto } from "./dto/create-job.dto";
import { Job, JobDocument } from "./schemas/job.schema";
import { UpdateJobDto } from "./dto/update-job.dto";
import { CompaniesService } from "@/companies/companies.service";
import { ObjectId } from "mongoose";

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name)
    private jobModel: SoftDeleteModel<JobDocument>,
    private companiesService: CompaniesService
  ) {}

  checkMatch(id) {
    return id.match(/^[0-9a-fA-F]{24}$/);
  }
  async create(createjobDto: CreateJobDto, user: IUser) {
    const _company = await this.companiesService.findOne(
      createjobDto.company._id
    );
    if (!_company) {
      throw new BadRequestException("Công ty không tồn tại");
    }
    const _create = await this.jobModel.create({
      ...createjobDto,
      createdBy: {
        _id: user._id,
        mail: user.email,
      },
      company: {
        _id: _company._id,
        name: _company.name,
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
      const totalItems = (await this.jobModel.find(filter)).length;
      const totalPages = Math.ceil(totalItems / defaultLimit);
      const result = await this.jobModel
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
      const _find = this.jobModel.findById(id);
      return _find;
    } else {
      return {
        message: "Không tìm thấy người dùng",
      };
    }
  }

  async update(id: string, updatejobDto: UpdateJobDto, user: IUser) {
    try {
      if (this.checkMatch(id)) {
        return await this.jobModel.updateOne(
          { _id: id },
          {
            ...updatejobDto,
            updatedBy: {
              _id: user._id,
              mail: user.email,
            },
          }
        );
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
        await this.jobModel.softDelete({ _id: id });
        await this.jobModel.updateOne(
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
}
