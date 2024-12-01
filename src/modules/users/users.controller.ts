import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	UseInterceptors,
	ClassSerializerInterceptor,
	Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { Public } from '../auth/auth.decorator';
import { checkAbilites } from '../casl/abilities.decorator';
import { AbilitiesGuard } from '../casl/ability.guard';
@ApiTags('Users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@ApiOperation({ description: 'Create some fresh user' })
	@ApiResponse({
		status: 200,
		description: 'description goes here',
		schema: {
			example: {
				name: 'user04',
				username: 'user04',
				age: 18,
				role: {
					id: '0c9540b4-b39d-5ea5-8117-7fe785c01e85',
				},
				id: '49c6be16-3e39-4642-b49e-15b9b596621f',
				createdAt: '2024-03-14T00:32:32.096Z',
				updatedAt: '2024-03-14T00:32:32.096Z',
				deletedAt: null,
			},
		},
	})
	@Public()
	@Post()
	async create(@Body() createUserDto: CreateUserDto): Promise<User> {
		return await this.usersService.create(createUserDto);
	}

	@Get()
	findAll() {
		return this.usersService.findAll();
	}

	@checkAbilites({ action: 'read', subject: 'Story' })
	@UseGuards(AbilitiesGuard)
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.usersService.findOne(id);
	}

	@checkAbilites({
		action: 'update',
		subject: 'User',
		conditions: true,
		fields: true,
	})
	@UseGuards(AbilitiesGuard)
	@ApiBody({
		schema: {
			example: {
				username: 'bean01',
				name: 'bean01',
			},
		},
	})
	@Patch(':id')
	update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.usersService.update(id, updateUserDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.usersService.remove(+id);
	}

	@Get('search')
	search(
		@Query('searchField') searchField,
		@Query('value') value,
		@Query('fuzziness') fuzziness,
	) {
		return this.usersService.search(searchField, value, fuzziness);
	}
}
