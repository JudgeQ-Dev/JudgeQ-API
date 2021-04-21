import { ApiProperty } from "@nestjs/swagger";

export enum SwapTwoAnnouncementOrderResponseError {
  PERMISSION_DENIED = "PERMISSION_DENIED",
  INVALID_ANNOUNCEMENT_ORGIN_ID = "INVALID_ANNOUNCEMENT_ORGIN_ID",
  INVALID_ANNOUNCEMENT_NEW_ID = "INVALID_ANNOUNCEMENT_NEW_ID",
}

export class SwapTwoAnnouncementOrderResponseDto {
  @ApiProperty({ enum: SwapTwoAnnouncementOrderResponseError })
  error?: SwapTwoAnnouncementOrderResponseError;
}
