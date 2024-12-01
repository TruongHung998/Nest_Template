import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';
import { connectionSource } from 'src/config/typeorm';
import { Role } from '../roles/entities/role.entity';
import { UserElasticIndex } from '../search/search-index/user.elastic.index';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
		private readonly userEsIndex: UserElasticIndex,
	) {}
	async create(createUserDto: CreateUserDto): Promise<User> {
		try {
			const saltOrRounds = 10;

			//Default assign User Role
			const roleUser = await connectionSource.getRepository(Role).findOne({
				where: {
					name: 'User',
				},
			});

			createUserDto.password = await hash(createUserDto.password, saltOrRounds);
			const user = await this.usersRepository.save({
				...createUserDto,
				role: { id: roleUser.id },
			});
			return new User({ ...user });
		} catch (error) {
			if (
				String(error.sqlMessage).includes('user.IDX_78a916df40e02a9deb1c4b75ed')
			) {
				throw new BadRequestException({
					error: 'Bad Request',
					message: ['username.duplicate'],
					statusCode: HttpStatus.BAD_REQUEST,
				});
			}
			throw new BadRequestException(error);
		}
	}

	findAll() {
		return `This action returns all users`;
	}

	async findOne(id: string) {
		const user = await this.usersRepository.findOne({
			where: {
				id,
			},
			relations: ['role'],
		});
		return user;
	}

	async update(id: any, updateUserDto: UpdateUserDto) {
		let user = await this.usersRepository.findOne({ where: { id } });
		const updateUser = { ...user, ...updateUserDto };
		user = await this.usersRepository.save(updateUser);
		delete user.password;
		return user;
	}

	remove(id: number) {
		return `This action removes a #${id} user`;
	}

	async search(searchField: string, value: string, fuzziness: number) {
		return await this.userEsIndex.searchUser(value, [searchField], fuzziness);
	}
}
