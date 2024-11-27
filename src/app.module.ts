import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";
import { softDeletePlugin } from "soft-delete-plugin-mongoose";
import { FilesModule } from "./files/files.module";
import { PermissionsModule } from "./permissions/permissions.module";
import { RolesModule } from "./roles/roles.module";
import { UserPgModule } from "./user-pg/user.module";
import { User } from "./user-pg/entities/user.entity";
import { MinioClientModule } from "./minio/minio-client.module";
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGO_DB"),
        connectionFactory: (connection) => {
          connection.plugin(softDeletePlugin);
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get<string>("POSTGRES_HOST"),
        port: configService.get<number>("POSTGRES_PORT"),
        username: configService.get<string>("POSTGRES_USER"),
        password: configService.get<string>("POSTGRES_PASSWORD"),
        database: configService.get<string>("POSTGRES_DATABASE"),
        entities: [__dirname + "/**/*.entity{.ts,.js}"],
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
    }),
    MinioClientModule,
    UserModule,
    AuthModule,
    FilesModule,
    PermissionsModule,
    RolesModule,
    UserPgModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
