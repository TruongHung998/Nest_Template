import { Controller, Post, Request, UseGuards } from "@nestjs/common";
import { AppService } from "./app.service";
import { LocalAuthGuard } from "./auth/local-auth.guard";
import { AuthService } from "./auth/auth.service";
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
     private readonly authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post("/login")
  async handleLogin(@Request() req) {
    return this.authService.login(req.user)
  }
}
