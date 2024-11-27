import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PermissionsService } from "./permissions.service";
import { Permission } from "./entities/permission.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Permission])],
  providers: [PermissionsService],
  exports: [PermissionsService],
})
export class PermissionsModule {}
