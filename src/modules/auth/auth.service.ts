import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { connectionSource } from 'src/config/typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
	constructor(private jwtService: JwtService) {}

	async validateUser(username: string, password: string): Promise<User> {
		const user = await connectionSource.getRepository(User).findOne({
			where: {
				username,
			},
			relations: ['role'],
		});
		if (!user) {
			throw new BadRequestException({
				message: 'User not found!',
			});
		}
		const isMatch = await compare(password, user.password);
		if (!isMatch) {
			throw new UnauthorizedException();
		}
		return user;
	}

	async login(user: User) {
		const payload = { sub: user.id, username: user.username, role: user.role }; // why we named sub for user.id? it's JWT standard...
		return {
			access_token: this.jwtService.sign(payload),
		};
	}
}
