import { ApiProperty } from "@nestjs/swagger";

import { DiscussionPermissionLevel } from "@/discussion/discussion.service";

import { UserMetaDto } from "@/user/dto";

export enum GetDiscussionPermissionsResponseError {
  PERMISSION_DENIED = "PERMISSION_DENIED",
  NO_SUCH_DISCUSSION = "NO_SUCH_DISCUSSION",
}

class DiscussionUserPermissionDto {
  @ApiProperty()
  user: UserMetaDto;

  @ApiProperty({
    enum: Object.values(DiscussionPermissionLevel).filter(
      (x) => typeof x === "number",
    ),
  })
  permissionLevel: DiscussionPermissionLevel;
}

class DiscussionPermissionsDto {
  @ApiProperty({ type: [DiscussionUserPermissionDto] })
  userPermissions: DiscussionUserPermissionDto[];
}

export class GetDiscussionPermissionsResponseDto {
  @ApiProperty({ enum: GetDiscussionPermissionsResponseError })
  error?: GetDiscussionPermissionsResponseError;

  @ApiProperty()
  permissions?: DiscussionPermissionsDto;

  @ApiProperty()
  haveManagePermissionsPermission?: boolean;
}
