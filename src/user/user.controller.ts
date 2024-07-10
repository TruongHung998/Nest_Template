import { Public, ResponseMessage, User } from "@/decorator/customize";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { RegisterUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserService } from "./user.service";
import { IUser } from "./users.interface";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  @ResponseMessage('Create User')
  create(@Body() RegisterUserDto: RegisterUserDto, @User() user: IUser) {
    return this.userService.create(RegisterUserDto, user);
  }
  @Get()
  @ResponseMessage("Get all user")
  findAll(@Query() qs: string) {
    return this.userService.findAll(qs);
  }

  @Public()
  @Get(":id")
  @ResponseMessage("Get user by id")
  findOne(@Param("id") id: number) {
    return this.userService.findOne(id);
  }

  @Patch()
  @ResponseMessage("Update user")
  update(@Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    return this.userService.update(updateUserDto, user);
  }
  @ResponseMessage("Delete User")
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.userService.remove(id);
  }
}
