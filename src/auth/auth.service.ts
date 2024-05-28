import { Injectable } from "@nestjs/common";
import { UserService } from "@/user/user.service";

@Injectable()
export class AuthService {
  constructor(private usersService: UserService) {}
  async validateUser(username: string, pass: string): Promise<any> {    
    const user = await this.usersService.findByEmail(username);    
    if (user) {
      const _valid = this.usersService.checkPassword(pass, user.password);
      return _valid ? user : null;
    }
    return null;
  }
}
