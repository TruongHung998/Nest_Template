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
  @ResponseMessage('Tạo người dùng thành công')
  create(@Body() RegisterUserDto: RegisterUserDto, @User() user: IUser) {
    return this.userService.create(RegisterUserDto, user);
  }
  @Get()
  @ResponseMessage("Kết quả thành công")
  findAll(@Query() qs: string) {
    return this.userService.findAll(qs);
  }

  @Public()
  @Get(":id")
  findOne(@Param("id") id: number) {
    return this.userService.findOne(id);
  }

  @Patch()
  @ResponseMessage("Cập nhật người dùng thành công")
  update(@Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    return this.userService.update(updateUserDto, user);
  }
  @Public()
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.userService.remove(id);
  }
}
