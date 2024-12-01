import { Global, Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { UserElasticIndex } from './search-index/user.elastic.index';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
	imports: [
		ElasticsearchModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				node: configService.get('elasticSearch.node'),
				maxRetries: 10,
				requestTimeout: 60000,
			}),
			inject: [ConfigService],
		}),
	],
	providers: [SearchService, UserElasticIndex],
	controllers: [],
	exports: [SearchModule, UserElasticIndex, SearchService],
})
export class SearchModule {}
