import { Controller, Post, Request, UseGuards } from "@nestjs/common";
import { AppService } from "./app.service";
import { LocalAuthGuard } from "./auth/local-auth.guard";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @UseGuards(LocalAuthGuard)
  @Post("/login")
  async handleLogin(@Request() req) {
    return req.user;
  }
}
