import { Public } from "@/decorator/customize";
import { Controller, Post, Request, UseGuards } from "@nestjs/common";
import { LocalAuthGuard } from "./local-auth.guard";
import { AuthService } from "./auth.service";
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Public()
  @Post("/login")
  async handleLogin(@Request() req) {
    return this.authService.login(req.user);
  }
}
