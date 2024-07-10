import { Public, ResponseMessage } from "@/decorator/customize";
import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import { LocalAuthGuard } from "./local-auth.guard";
import { AuthService } from "./auth.service";
import { RegisterUserDto } from "@/user/dto/create-user.dto";
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Public()
  @Post("/login")
  @ResponseMessage("User Login")
  async handleLogin(@Request() req) {    
    return this.authService.login(req.user);
  }
  @Public()
  @Post("/register")
  @ResponseMessage("Tạo người dùng thành công")
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }
}
