import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as crypto from "crypto";
import { MinioService } from "nestjs-minio-client";
import { BufferedFile } from "../files/file.model";
const config = {
  MINIO_ENDPOINT: "localhost",
  MINIO_PORT: 9000,
  MINIO_BUCKET: "image",
};

@Injectable()
export class MinioServiceLocal {
  constructor(private readonly minioService: MinioService) {}

  public async upload(file: BufferedFile, baseBucket: "image") {
    if (!(file.mimetype.includes("jpeg") || file.mimetype.includes("png"))) {
      throw new HttpException("Error uploading file", HttpStatus.BAD_REQUEST);
    }
    let temp_filename = Date.now().toString();
    let hashedFileName = crypto
      .createHash("md5")
      .update(temp_filename)
      .digest("hex");
    let ext = file.originalname.substring(
      file.originalname.lastIndexOf("."),
      file.originalname.length
    );
    const metaData = {
      "Content-Type": file.mimetype,
      "X-Amz-Meta-Testing": 1234,
    };
    let filename = hashedFileName + ext;
    const fileName: string = `${filename}`;
    const fileBuffer = file.buffer;
    this.minioService.client.putObject(
      baseBucket,
      fileName,
      fileBuffer,
      fileBuffer.length,
      metaData
    );

    return {
      url: `${config.MINIO_ENDPOINT}:${config.MINIO_PORT}/${config.MINIO_BUCKET}/${filename}`,
    };
  }

  async deleteFile(bucketName: string, objectName: string): Promise<void> {
    await this.minioService.client.removeObject(bucketName, objectName);
  }
}
