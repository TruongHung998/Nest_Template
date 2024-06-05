import { Injectable } from "@nestjs/common";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { InjectModel } from "@nestjs/mongoose";
import { IUser } from "@/user/users.interface";
import { Company, CompanyDocument } from "./schema/company.entity";

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

  findAll() {
    return `This action returns all companies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto, user) {
    console.log(id, "id");

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

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
