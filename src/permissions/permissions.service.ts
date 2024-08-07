import { IUser } from "@/user/users.interface";
import { Injectable, Query } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import aqp from "api-query-params";
import { ObjectId } from "mongoose";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import { CreatePermissionDto } from "./dto/create-permission.dto";
import { UpdatePermissionDto } from "./dto/update-permission.dto";
import { Permission, PermissionDocument } from "./schema/permission.schema";

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: SoftDeleteModel<PermissionDocument>
  ) {}
  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const _find = await this.permissionModel.find({
      name: createPermissionDto.name,
      apiPath: createPermissionDto.apiPath,
    });
    if (_find.length > 0) {
      return {
        message: "Perrmission tồn tại name hoặc apiPath",
      };
    }
    const _create = await this.permissionModel.create({
      ...createPermissionDto,
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
      const totalItems = (await this.permissionModel.find(filter)).length;
      const totalPages = Math.ceil(totalItems / defaultLimit);
      const result = await this.permissionModel
        .find(filter)
        .skip(offset)
        .limit(defaultLimit)
        // @ts-ignore: Unreachable code error .sort(sort)
        .populate(population)
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
    const _find = this.permissionModel.findById(id);
    return _find;
  }

  async update(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
    user: IUser
  ) {
    try {
      return await this.permissionModel.updateOne(
        { _id: id },
        {
          ...updatePermissionDto,
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
      await this.permissionModel.softDelete({ _id: id });
      await this.permissionModel.updateOne(
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
