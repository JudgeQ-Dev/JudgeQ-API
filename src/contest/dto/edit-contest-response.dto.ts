import { ApiProperty } from "@nestjs/swagger";

export enum EditContestResponseError {
  PERMISSION_DENIED = "PERMISSION_DENIED",
  NO_SUCH_CONTEST = "NO_SUCH_CONTEST",
  FAILED = "FAILED",
}

export class EditContestResponseDto {
  @ApiProperty({ enum: EditContestResponseError })
  error?: EditContestResponseError;
}
