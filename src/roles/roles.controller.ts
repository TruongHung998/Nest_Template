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
import { RolesService } from "./roles.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { IUser } from "@/user/users.interface";
import { ResponseMessage, User } from "@/decorator/customize";

@Controller("roles")
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ResponseMessage("Create")
  create(@Body() createRoleDto: CreateRoleDto, @User() user: IUser) {
    return this.rolesService.create(createRoleDto, user);
  }

  @Get()
  @ResponseMessage("Get List")
  findAll(@Query() qs: string) {
    return this.rolesService.findAll(qs);
  }

  @Get(":id")
  @ResponseMessage("Get By Id")
  findOne(@Param("id") id: string) {
    return this.rolesService.findOne(id);
  }

  @Put(":id")
  @ResponseMessage("Update By Id")
  update(
    @Param("id") id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @User() user: IUser
  ) {
    return this.rolesService.update(id, updateRoleDto, user);
  }

  @Delete(":id")
  @ResponseMessage("Delete By Id")
  remove(@Param("id") id: string, @User() user: IUser) {
    return this.rolesService.remove(id, user);
  }
}
