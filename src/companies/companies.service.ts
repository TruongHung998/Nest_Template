import { Injectable, Query } from "@nestjs/common";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { InjectModel } from "@nestjs/mongoose";
import { IUser } from "@/user/users.interface";
import { Company, CompanyDocument } from "./schema/company.schema";
import aqp from "api-query-params";

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name)
    private companyModel: SoftDeleteModel<CompanyDocument>
  ) {}

  checkMatch(id) {
    return id.match(/^[0-9a-fA-F]{24}$/);
  }
  async create(createCompanyDto: CreateCompanyDto, user: IUser) {
    const _create = await this.companyModel.create({
      ...createCompanyDto,
      createdBy: {
        _id: user._id,
        mail: user.email,
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
      const totalItems = (await this.companyModel.find(filter)).length;
      const totalPages = Math.ceil(totalItems / defaultLimit);
      const result = await this.companyModel
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

  findOne(id: string) {
    if (this.checkMatch(id)) {
      const _find = this.companyModel.findById(id);
      return _find;
    } else {
      return {
        message: "Không tìm thấy người dùng",
      };
    }
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {
    try {
      if (this.checkMatch(id)) {
        return await this.companyModel.updateOne(
          { _id: id },
          {
            ...updateCompanyDto,
            updatedBy: {
              _id: user._id,
              mail: user.email,
            },
          }
        );
      } else {
        return {
          message: "Không tìm thấy công ty",
        };
      }
    } catch (e) {
      return {
        message: "Không tìm thấy công ty",
      };
    }
  }

  async remove(id: string, user: IUser) {
    try {
      if (this.checkMatch(id)) {
        await this.companyModel.softDelete({ _id: id });
        await this.companyModel.updateOne(
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
