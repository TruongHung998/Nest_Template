import { Client } from "minio";
import { StorageEngine } from "multer";

class MinioStorage implements StorageEngine {
  private minioClient: Client;

  constructor(minioClient: Client) {
    this.minioClient = minioClient;
  }

  _handleFile(req, file, cb) {
    return file
  }

  uploadFile(
    bucketName: string,
    fileName: string,
    fileStream: any,
    fileSize: number,
    cb: any
  ) {
    this.minioClient.putObject(
      bucketName,
      fileName,
      fileStream,
      fileSize,
      (err: any, etag: any) => {
        if (err) {
          return cb(err);
        }
        cb(null, {
          bucket: bucketName,
          key: fileName,
          etag: etag,
        });
      }
    );
  }

  _removeFile(req, file, cb) {
    this.minioClient.removeObject(file.bucket, file.key, cb);
  }
}

export function minioStorage(minioClient: Client): StorageEngine {
  return new MinioStorage(minioClient);
}
