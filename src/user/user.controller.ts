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
  @ResponseMessage('Create a new User')
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
    console.log(id, "id");

    return this.userService.findOne(id);
  }

  @Patch()
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto);
  }
  @Public()
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.userService.remove(id);
  }
}
