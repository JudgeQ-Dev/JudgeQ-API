import { ApiProperty } from "@nestjs/swagger";

export enum AddAnnouncementResponseError {
  PERMISSION_DENIED = "PERMISSION_DENIED",
  ANNOUNCEMENT_ALREADY_EXISTS = "ANNOUNCEMENT_ALREADY_EXISTS",
  INVALID_DISCUSSION_ID = "INVALID_DISCUSSION_ID",
}

export class AddAnnouncementResponseDto {
  @ApiProperty({ enum: AddAnnouncementResponseError })
  error?: AddAnnouncementResponseError;
}
