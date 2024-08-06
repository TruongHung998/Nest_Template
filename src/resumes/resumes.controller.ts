import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from "@nestjs/common";
import { ResumesService } from "./resumes.service";
import { CreateResumeDto } from "./dto/create-resume.dto";
import { UpdateResumeDto } from "./dto/update-resume.dto";
import { ResponseMessage, User } from "@/decorator/customize";
import { IUser } from "@/user/users.interface";

@Controller("resumes")
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  @ResponseMessage("Create")
  create(@Body() createResumeDto: CreateResumeDto, @User() user: IUser) {
    return this.resumesService.create(createResumeDto, user);
  }

  @Get()
  @ResponseMessage("Get List")
  findAll(@Query() qs: string) {
    return this.resumesService.findAll(qs);
  }

  @Get(":id")
  @ResponseMessage("Get By Id")
  findOne(@Param("id") id: string) {
    return this.resumesService.findOne(id);
  }
  @Get("get-by-user/:id")
  @ResponseMessage("Get By Id")
  findByUser(@Param("id") id: string) {
    return this.resumesService.findByUser(id);
  }

  @Put(":id")
  @ResponseMessage("Update")
  update(
    @Param("id") id: string,
    @Body() updateResumeDto: UpdateResumeDto,
    @User() user: IUser
  ) {
    return this.resumesService.update(id, updateResumeDto, user);
  }
  @Delete(":id")
  @ResponseMessage("Delete By Id")
  remove(@Param("id") id: string, @User() user: IUser) {
    return this.resumesService.remove(id, user);
  }
}
