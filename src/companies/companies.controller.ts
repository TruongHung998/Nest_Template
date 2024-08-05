import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { CompaniesService } from "./companies.service";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { ResponseMessage, User } from "@/decorator/customize";
import { IUser } from "@/user/users.interface";

@Controller("companies")
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @ResponseMessage("Create Company")
  create(@Body() createCompanyDto: CreateCompanyDto, @User() user: IUser) {
    return this.companiesService.create(createCompanyDto, user);
  }

  @Get()
  @ResponseMessage("Get List Company")
  findAll(@Query() qs: string) {
    return this.companiesService.findAll(qs);
  }

  @Get(":id")
  @ResponseMessage("Get Company By Id")
  findOne(@Param("id") id: string) {
    return this.companiesService.findOne(id);
  }

  @Patch(":id")
  @ResponseMessage("Update Company By Id")
  update(
    @Param("id") id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @User() user: IUser
  ) {
    return this.companiesService.update(id, updateCompanyDto, user);
  }

  @Delete(":id")
  @ResponseMessage("Delete Company By Id")
  remove(@Param("id") id: string, @User() user: IUser) {
    return this.companiesService.remove(id, user);
  }
}
