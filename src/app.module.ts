import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { MongooseModule } from "@nestjs/mongoose";
import { TypeOrmModule } from "@nestjs/typeorm";
import { softDeletePlugin } from "soft-delete-plugin-mongoose";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { GlobalExceptionFilter } from "./exception-filters/global-exception.filter";
import { AuthModule } from "./modules/auth/auth.module";
import { JwtAuthGuard } from "./modules/auth/jwt-auth.guard";
import { FilesModule } from "./modules/files/files.module";
import { MinioClientModule } from "./modules/minio/minio-client.module";
import { PermissionsModule } from "./modules/permissions/permissions.module";
import { RolesModule } from "./modules/roles/roles.module";
import { SearchModule } from "./modules/search/search.module";
import { UsersModule } from "./modules/users/users.module";
import { CaslModule } from "./modules/casl/casl.module";
import { RedisOptions } from "./config/redis.config";
import { CacheModule } from "@nestjs/cache-manager";
import { UtilsModule } from "./utils/utils.module";
import typeorm from './config/typeorm';
import configuration from './config/configuration';
import * as Joi from 'joi';

@Module({
  imports: [
		ConfigModule.forRoot({
			validationSchema: Joi.object({
				NODE_ENV: Joi.string()
					.valid('develop', 'production', 'test', 'staging')
					.default('develop'),
				PORT: Joi.number().default(3000),
			}),
			load: [configuration, typeorm],
			cache: true,
			expandVariables: true,
		}),

    CacheModule.registerAsync(RedisOptions),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get("typeorm"),
    }),
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    RolesModule,
    PermissionsModule,
    SearchModule,
    CaslModule,
    UtilsModule,
    FilesModule,
    MinioClientModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
