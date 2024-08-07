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
import { CreatePermissionDto } from "./dto/create-Permission.dto";
import { UpdatePermissionDto } from "./dto/update-Permission.dto";
import { PermissionsService } from "./permissions.service";

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
  findAll(@Query() qs: string) {
    return this.permissionsService.findAll(qs);
  }

  @Get(":id")
  @ResponseMessage("Get By Id")
  findOne(@Param("id") id: string) {
    return this.permissionsService.findOne(id);
  }

  // @Put(":id")
  // @ResponseMessage("Update By Id")
  // update(
  //   @Param("id") id: string,
  //   @Body() updatePermissionDto: UpdatePermissionDto,
  //   @User() user: IUser
  // ) {
  //   console.log(updatePermissionDto, "updatePermissionDto");
  //   return this.permissionsService.update(id, updatePermissionDto, user);
  // }

  // @Delete(":id")
  // @ResponseMessage("Delete By Id")
  // remove(@Param("id") id: string, @User() user: IUser) {
  //   return this.permissionsService.remove(id, user);
  // }
}
