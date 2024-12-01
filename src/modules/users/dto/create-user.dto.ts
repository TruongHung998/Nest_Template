import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
	@ApiProperty({ example: 'Bean Bean', description: 'Your display name...' })
	@IsString()
	name: string;

	@ApiProperty({ example: 'bean01', description: 'Unique username' })
	@IsString()
	username: string;

	@ApiProperty({
		example: '12345Aa@',
		description: '...Strong password please...',
	})
	@IsString()
	@MinLength(6)
	@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message: 'password too weak',
	})
	password: string;
}
