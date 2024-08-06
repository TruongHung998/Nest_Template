import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UpdateFileDto } from "./dto/update-file.dto";
import { FilesService } from "./files.service";

@Controller("files")
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /jpg|jpeg|png/,
        })
        .addMaxSizeValidator({
          maxSize: 1024 * 1000 * 10,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        })
    )
    file: Express.Multer.File
  ) {
    return file
  }

  @Get()
  findAll() {
    return this.filesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.filesService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.filesService.update(+id, updateFileDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.filesService.remove(+id);
  }
}
