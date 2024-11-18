import { Injectable } from "@nestjs/common";
import { MinioServiceLocal } from "../minio/minio.service";
import { BufferedFile } from "./file.model";

@Injectable()
export class FilesService {
  constructor(private readonly minioService: MinioServiceLocal) {}

  async uploadFile(image: BufferedFile) {
    let uploaded_image = await this.minioService.upload(image, "image");

    return {
      image_url: uploaded_image.url,
      message: "Successfully uploaded to MinIO S3",
    };
  }

  // Add other methods as needed
}
