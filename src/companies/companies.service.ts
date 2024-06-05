import { Injectable } from "@nestjs/common";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { Company, CompanyDocument } from "./schemas/company.entity";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name)
    private companyModel: SoftDeleteModel<CompanyDocument>
  ) {}
  async create(createCompanyDto: CreateCompanyDto) {
    const _create = await this.companyModel.create({
      ...createCompanyDto,
    });
    return _create;
  }

  findAll() {
    return `This action returns all companies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
