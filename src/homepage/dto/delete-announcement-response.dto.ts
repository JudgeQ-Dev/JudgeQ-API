import { ApiProperty } from "@nestjs/swagger";

export enum DeleteAnnouncementResponseError {
  PERMISSION_DENIED = "PERMISSION_DENIED",
  INVALID_ANNOUNCEMENT_ID = "INVALID_ANNOUNCEMENT_ID",
}

export class DeleteAnnouncementResponseDto {
  @ApiProperty({ enum: DeleteAnnouncementResponseError })
  error?: DeleteAnnouncementResponseError;
}
