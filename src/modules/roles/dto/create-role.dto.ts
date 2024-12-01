import { IsObject, IsOptional, IsString } from 'class-validator';
export class CreateRoleDto {
	@IsString()
	name: string;

	@IsObject()
	@IsOptional()
	inheritance?: {
		id: string;
	};
}
