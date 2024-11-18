import { ConfigModule, ConfigService } from "@nestjs/config";
import { MinioModule } from "nestjs-minio-client";
import { Module } from "@nestjs/common";
import { MinioServiceLocal } from "./minio.service";
@Module({
  imports: [
    MinioModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        endPoint: configService.get<string>("MINIO_ENDPOINT"),
        port: parseInt(configService.get<string>("MINIO_PORT"), 10),
        useSSL: configService.get<string>("MINIO_USE_SSL") === "true",
        accessKey: configService.get<string>("MINIO_ACCESS_KEY"),
        secretKey: configService.get<string>("MINIO_SECRET_KEY"),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MinioServiceLocal],
  exports: [MinioServiceLocal],
})
export class MinioClientModule {}
