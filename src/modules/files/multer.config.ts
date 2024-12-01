import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from "@nestjs/platform-express";
import { Client } from "minio";
import { minioStorage } from "../minio/minio.storage";
@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createMulterOptions(): MulterModuleOptions {
    const minioClient = new Client({
      endPoint: this.configService.get<string>("MINIO_ENDPOINT"),
      port: parseInt(this.configService.get<string>("MINIO_PORT"), 10),
      useSSL: this.configService.get<string>("MINIO_USE_SSL") === "true",
      accessKey: this.configService.get<string>("MINIO_ACCESS_KEY"),
      secretKey: this.configService.get<string>("MINIO_SECRET_KEY"),
    });

    return {
      storage: minioStorage(minioClient),
    };
  }
}
