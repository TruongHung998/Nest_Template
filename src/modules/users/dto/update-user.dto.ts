import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsObject, IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
	@IsObject()
	@IsOptional()
	role?: {
		id: string;
	};
}
