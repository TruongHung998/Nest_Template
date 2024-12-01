import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class PermissionsService {
	constructor(
		@InjectRepository(Permission)
		private permissionRepository: Repository<Permission>,
		private utilsService: UtilsService,
	) {}
	async create(createPermissionDto: CreatePermissionDto) {
		const perm = await this.permissionRepository.save(createPermissionDto);
		this.utilsService.deleteKeyRedisByPattern(0, 'permission:*', 100);
		return perm;
	}

	findAll() {
		return `This action returns all permissions`;
	}

	findOne(id: number) {
		return `This action returns a #${id} permission`;
	}

	update(id: number) {
		return `This action updates a #${id} permission`;
	}

	remove(id: number) {
		return `This action removes a #${id} permission`;
	}
}
