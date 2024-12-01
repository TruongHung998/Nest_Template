import {
	IsArray,
	IsBoolean,
	IsObject,
	IsOptional,
	IsString,
} from 'class-validator';

export class CreatePermissionDto {
	@IsString()
	action: string;

	@IsString()
	subject: string;

	@IsObject()
	role: {
		id: string;
	};

	@IsBoolean()
	@IsOptional()
	inverted?: boolean;

	@IsObject()
	@IsOptional()
	conditions?: object;

	@IsArray()
	@IsOptional()
	fields?: string[];

	@IsString()
	@IsOptional()
	reason?: string;
}
