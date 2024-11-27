import { IsNotEmpty, IsString, IsBoolean, IsOptional } from "class-validator";

export class CreatePermissionDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsString()
  createdBy?: string;

  @IsOptional()
  @IsString()
  updatedBy?: string;
}
