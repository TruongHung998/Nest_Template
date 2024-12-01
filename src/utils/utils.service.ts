import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { RedisStore } from 'cache-manager-redis-yet';
@Injectable()
export class UtilsService {
	private readonly redisStore!: RedisStore;
	constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
		this.redisStore = cacheManager.store as unknown as RedisStore;
	}

	async deleteKeyRedisByPattern(
		cursor: number,
		pattern: string,
		count: number,
	) {
		const listPermis = await this.redisStore.client.scan(cursor, {
			MATCH: pattern,
			COUNT: count,
		});
		listPermis.keys.forEach((k) => {
			this.cacheManager.del(k);
		});
	}
}
