import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';

export const RedisOptions: CacheModuleAsyncOptions = {
	isGlobal: true,
	imports: [ConfigModule],
	useFactory: async (configService: ConfigService) => {
		const store = await redisStore({
			socket: {
				host: configService.get<string>('redis.host'),
				port: parseInt(configService.get<string>('redis.port')!),
			},
			password: configService.get<string>('redis.password'),
			database: +configService.get<string>('redis.common_db'),
			ttl: +configService.get<string>('redis.ttl'),
		});
		return {
			store: () => store,
		};
	},
	inject: [ConfigService],
};
