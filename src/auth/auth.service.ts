import { BadRequestException, Injectable } from "@nestjs/common";
import { UserService } from "@/user/user.service";
import { JwtService } from "@nestjs/jwt";
import { IUser } from "@/user/users.interface";
import { RegisterUserDto } from "@/user/dto/create-user.dto";
import { ConfigService } from "@nestjs/config";
import ms from "ms";
import { Response, Request } from "express";
@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user) {
      const _valid = this.usersService.checkPassword(pass, user.password);
      return _valid ? user : null;
    }
    return null;
  }
  async login(user: IUser, response: Response) {
    const { _id, role, email } = user;
    const payload = {
      sub: "token login",
      iss: "from server",
      _id,
      role,
      email,
    };
    const _refreshToken = this.createRefreshToken(payload);
    await this.usersService.updateUserToken(_refreshToken, _id);
    // update user with refresh token
    // set refreshToken as cookies
    response.clearCookie("refreshToken")
    response.cookie("refreshToken", _refreshToken, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>("EXPIRE_REFRESH_JWT")),
    });

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        _id,
        email,
        role,
      },
    };
  }
  async register(resgisterUser: RegisterUserDto) {
    const _newUser = await this.usersService.register(resgisterUser);
    return {
      _id: _newUser?.id,
      createdAt: _newUser.createdAt,
    };
  }
  createRefreshToken = (payload) => {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
      expiresIn:
        ms(this.configService.get<string>("EXPIRE_REFRESH_JWT")) / 1000,
    });
    return refreshToken;
  };
  async findOneUSer(_id: string) {
    return this.usersService.findOne(_id);
  }
  async findUserByToken(token: string) {
    return this.usersService.findByToken(token);
  }
  async processNewToken(req: Request, response: Response) {
    try {
      const _refreshToken = req.cookies["refreshToken"];
      const _validate = this.jwtService.verify(_refreshToken, {
        secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
      });
      if (_validate) {
        const _user = await this.findUserByToken(_refreshToken);
        const { _id, role, email } = _user;
        const _iUser: IUser = {
          _id: _id.toString(),
          role,
          email,
        };
        if (_user) {
          return this.login(_iUser, response);
        } else {
          throw new BadRequestException("Không tìm thấy người dùng");
        }
      }
      return {
        refreshToken: _refreshToken,
      };
    } catch (errors) {
      throw new BadRequestException(
        `RefreshToken không hợp lệ. vui lòng login`
      );
    }
  }
}
