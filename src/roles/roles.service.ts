import { Injectable, Query } from "@nestjs/common";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import { Role, RoleDocument } from "./schema/role.schema";
import { InjectModel } from "@nestjs/mongoose";
import { IUser } from "@/user/users.interface";
import aqp from "api-query-params";
import { ObjectId } from "mongoose";

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

  async findAll(@Query() qs: string) {
    try {
      const { filter, projection, population, limit } = aqp(qs);
      const { page } = filter;
      let offset = (+page - 1) * +limit;
      let defaultLimit = +limit ? +limit : 10;
      delete filter.page;
      const totalItems = (await this.roleModel.find(filter)).length;
      const totalPages = Math.ceil(totalItems / defaultLimit);
      const result = await this.roleModel
        .find(filter)
        .skip(offset)
        .limit(defaultLimit)
        // @ts-ignore: Unreachable code error .sort(sort)
        .populate({
          path: "permission",
          select: { _id: 1, apiPath: 1, name: 1, method: 1 },
        })
        .exec();
      return {
        length: result.length,
        totalPages,
        result,
      };
    } catch (e) {
      return e;
    }
  }

  findOne(id: ObjectId | string) {
    const _find = this.roleModel.findById(id).populate({
      path: "permission",
      select: { _id: 1, apiPath: 1, name: 1, method: 1, module: 1 },
    });
    return _find;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    try {
      return await this.roleModel.updateOne(
        { _id: id },
        {
          ...updateRoleDto,
          updatedBy: {
            _id: user._id,
            mail: user.email,
          },
        }
      );
    } catch (e) {
      return {
        message: "Không tìm thấy",
      };
    }
  }

  async remove(id: string, user: IUser) {
    try {
      await this.roleModel.softDelete({ _id: id });
      await this.roleModel.updateOne(
        { _id: id },
        {
          deletedBy: {
            _id: user._id,
            mail: user.email,
          },
        }
      );
      return {
        success: true,
      };
    } catch (e) {
      return e;
    }
  }
}
