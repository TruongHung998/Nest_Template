import { Injectable } from "@nestjs/common";
import { UserService } from "@/user/user.service";
import { JwtService } from "@nestjs/jwt";
import { IUser } from "@/user/users.interface";
import { RegisterUserDto } from "@/user/dto/create-user.dto";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService
  ) {}
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(username);
    if (user) {
      const _valid = this.usersService.checkPassword(pass, user.password);
      return _valid ? user : null;
    }
    return null;
  }
  async login(user: IUser) {
    const { _id, userName, role, email } = user;
    const payload = {
      sub: "token login",
      iss: "from server",
      _id,
      userName,
      role,
      email,
    };
    return {
      access_token: this.jwtService.sign(payload),
      _id,
      userName,
      email,
      role,
    };
  }
  async register(resgisterUser: RegisterUserDto) {
    const _newUser = await this.usersService.register(resgisterUser);
    return {
      _id: _newUser?.id,
      createdAt: _newUser.createdAt,
    };
  }
}
