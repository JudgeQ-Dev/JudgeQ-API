import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PermissionService } from "./permission.service";
import { PermissionForUserEntity } from "./permission-for-user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([PermissionForUserEntity]),
  ],
  providers: [PermissionService],
  exports: [PermissionService]
})
export class PermissionModule {}
