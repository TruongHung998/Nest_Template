import { Public, ResponseMessage, User } from "@/decorator/customize";
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from "@nestjs/common";
import { LocalAuthGuard } from "./local-auth.guard";
import { AuthService } from "./auth.service";
import { RegisterUserDto } from "@/user/dto/create-user.dto";
import { Response } from "express";
import { IUser } from "@/user/users.interface";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Public()
  @Post("/login")
  @ResponseMessage("Login")
  async handleLogin(
    @Request() req,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.login(req.user, response);
  }
  @Public()
  @Post("/register")
  @ResponseMessage("Register User")
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Get("/account")
  @ResponseMessage("Get Account Infomation")
  async account(@User() user: IUser) {
    return this.authService.findOneUSer(user._id);
  }
  @Public()
  @Get("/refresh")
  @ResponseMessage("Refresh Token")
  async refreshToken(
    @Request() req,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.processNewToken(req, response);
  }
  @Get("/logout")
  @ResponseMessage("Logout User")
  async logout(
    @User() user: IUser,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.logout(user, response);
  }
}
