import { Controller, Delete, Get } from "@nestjs/common";

@Controller("user")
export class UserController {
  @Get()
  findAll(): string {
    return 'test';
  }
  @Delete("/by-id")
  deleteUser(): string {
    return "";
  }
}
