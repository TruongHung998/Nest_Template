import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { ApiTags } from '@nestjs/swagger';
import { checkAbilites } from '../casl/abilities.decorator';
import { AbilitiesGuard } from '../casl/ability.guard';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
	constructor(private readonly rolesService: RolesService) {}

	@Post()
	@checkAbilites({ action: 'create', subject: 'Role' })
	@UseGuards(AbilitiesGuard)
	create(@Body() createRoleDto: CreateRoleDto) {
		return this.rolesService.create(createRoleDto);
	}

	@Get()
	findAll() {
		return this.rolesService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.rolesService.findOne(+id);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.rolesService.remove(+id);
	}
}
