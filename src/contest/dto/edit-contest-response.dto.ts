import { ApiProperty } from "@nestjs/swagger";

export enum EditContestResponseError {
  PERMISSION_DENIED = "PERMISSION_DENIED",
  NO_SUCH_PROBLEM_TAG = "NO_SUCH_PROBLEM_TAG",
  FAILED = "FAILED"
}

export class EditContestResponseDto {
  @ApiProperty({ enum: EditContestResponseError })
  error?: EditContestResponseError;

}
