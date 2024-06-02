import { Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { AppService } from "./app.service";
import { LocalAuthGuard } from "./auth/local-auth.guard";
import { AuthService } from "./auth/auth.service";
import { Public } from "./decorator/customize";
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService
  ) {}
  @UseGuards(LocalAuthGuard)
  @Public()
  @Post("/login")
  async handleLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get("/getProfile")
  async getProfile(@Request() req) {  
    return req.user;
  }
}
