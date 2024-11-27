import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';
import aqp from 'api-query-params';
import { IUser } from "@/user/users.interface";

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto, user: IUser): Promise<Permission> {
    const permission = this.permissionRepository.create(createPermissionDto);
    return this.permissionRepository.save(permission);
  }

  async findAll(qs: string): Promise<Permission[]> {
    const { filter, projection, population, limit } = aqp(qs);
    const { page } = filter;
    let offset = (+page - 1) * +limit;
    const options: FindManyOptions<Permission> = {
      skip: offset,
      take: limit,
      where: filter
    };
    return this.permissionRepository.find(options);
  }

  async findOne(id: string): Promise<Permission> {
    return this.permissionRepository.findOne({ where: { id } });
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto): Promise<void> {
    await this.permissionRepository.update(id, updatePermissionDto);
  }

  async remove(id: string): Promise<void> {
    await this.permissionRepository.delete(id);
  }
}