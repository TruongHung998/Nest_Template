import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
	constructor(
		@InjectRepository(Role)
		private roleRepository: Repository<Role>,
	) {}
	async create(createRoleDto: CreateRoleDto) {
		return await this.roleRepository.save(createRoleDto);
	}

	findAll() {
		return `This action returns all roles`;
	}

	findOne(id: number) {
		return `This action returns a #${id} role`;
	}

	update(id: number) {
		return `This action updates a #${id} role`;
	}

	remove(id: number) {
		return `This action removes a #${id} role`;
	}
}
