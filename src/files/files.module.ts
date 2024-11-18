import { MinioClientModule } from "@/minio/minio-client.module";
import { Module } from "@nestjs/common";
import { FilesController } from "./files.controller";
import { FilesService } from "./files.service";

@Module({
  imports: [
    MinioClientModule,
  ],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
