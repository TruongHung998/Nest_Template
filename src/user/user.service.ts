import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./schemas/user.schema";
import { genSaltSync, hashSync, compareSync } from "bcryptjs";
import { log } from "console";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>
  ) {}

  checkMatch(id) {
    return id.match(/^[0-9a-fA-F]{24}$/);
  }

  getHashPassword(password) {
    var salt = genSaltSync(10);
    var hash = hashSync(password, salt);
    return hash;
  }

  async create(createUserDto: CreateUserDto) {
    const _hash = this.getHashPassword(createUserDto.password);

    const _user = await this.userModel.create({
      ...createUserDto,
      password: _hash,
    });
    return _user;
  }

  findAll() {
    return this.userModel.find();
  }

  findOne(id: number | string) {
    if (this.checkMatch(id)) {
      const _find = this.userModel.findById(id);
      return _find;
    } else {
      return {
        message: "Không tìm thấy người dùng",
      };
    }
  }

  async update(updateUserDto: UpdateUserDto) {
    try {
      if (this.checkMatch(updateUserDto._id)) {
        return await this.userModel.updateOne(
          { _id: updateUserDto._id },
          {
            ...updateUserDto,
          }
        );
      } else {
        return {
          message: "Không tìm thấy người dùng",
        };
      }
    } catch (e) {
      return e;
    }
  }

  async remove(id: string) {
    try {
      if (this.checkMatch(id)) {
        return await this.userModel.softDelete({ _id: id });
      } else {
        return {
          message: "Không tìm thấy người dùng",
        };
      }
    } catch (e) {
      return e;
    }
  }
  findByEmail(username: string) {
    const _find = this.userModel.findOne({ email: username });
    return _find;
  }
  checkPassword(pass: string, userPassword: string): Boolean {
    return compareSync(pass, userPassword);
  }
}
