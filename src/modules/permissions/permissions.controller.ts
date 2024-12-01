import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	UseGuards,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { ApiTags } from '@nestjs/swagger';
import { checkAbilites } from '../casl/abilities.decorator';
import { AbilitiesGuard } from '../casl/ability.guard';
@ApiTags('Permissions')
@Controller('permissions')
export class PermissionsController {
	constructor(private readonly permissionsService: PermissionsService) {}

	@Post()
	@checkAbilites({ action: 'create', subject: 'Permission' })
	@UseGuards(AbilitiesGuard)
	create(@Body() createPermissionDto: CreatePermissionDto) {
		return this.permissionsService.create(createPermissionDto);
	}

	@Get()
	findAll() {
		return this.permissionsService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.permissionsService.findOne(+id);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.permissionsService.remove(+id);
	}
}
