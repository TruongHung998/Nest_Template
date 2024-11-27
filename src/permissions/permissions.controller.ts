import { ResponseMessage, User } from "@/decorator/customize";
import { IUser } from "@/user/users.interface";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { CreatePermissionDto } from "./dto/create-permission.dto";
import { UpdatePermissionDto } from "./dto/update-permission.dto";
import { PermissionsService } from "./permissions.service";
import { ApiQueryParams } from 'nestjs-api-query-params';
import { Permission } from './entities/permission.entity';

@Controller("permissions")
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @ResponseMessage("Create")
  create(
    @Body() createPermissionDto: CreatePermissionDto,
    @User() user: IUser
  ) {
    return this.permissionsService.create(createPermissionDto, user);
  }

  @Get()
  @ResponseMessage("Get List")
  async findAll(@Query() query: ApiQueryParams): Promise<Permission[]> {
    return this.permissionsService.findAll(query);
  }

  @Get(":id")
  @ResponseMessage("Get By Id")
  findOne(@Param("id") id: string) {
    return this.permissionsService.findOne(id);
  }

  @Put(":id")
  @ResponseMessage("Update By Id")
  update(
    @Param("id") id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
    @User() user: IUser
  ) {
    return this.permissionsService.update(id, updatePermissionDto, user);
  }

  @Delete(":id")
  @ResponseMessage("Delete By Id")
  remove(@Param("id") id: string, @User() user: IUser) {
    return this.permissionsService.remove(id, user);
  }
}
