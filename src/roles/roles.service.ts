import { Injectable } from "@nestjs/common";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import { Role, RoleDocument } from "./schema/role.schema";
import { InjectModel } from "@nestjs/mongoose";
import { IUser } from "@/user/users.interface";

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private roleModel: SoftDeleteModel<RoleDocument>
  ) {}
  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const _find = await this.roleModel.find({
      name: createRoleDto.name,
    });
    if (_find.length > 0) {
      return {
        message: "Role tồn tại name",
      };
    }
    const _create = await this.roleModel.create({
      ...createRoleDto,
      createdBy: {
        _id: user._id,
        mail: user.email,
      },
    });
    return _create;
  }

  findAll() {
    return `This action returns all roles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
