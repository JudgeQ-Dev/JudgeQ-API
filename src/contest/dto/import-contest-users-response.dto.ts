import { ApiProperty } from "@nestjs/swagger";

export enum ImportContestUsersResponseError {
  PERMISSION_DENIED = "PERMISSION_DENIED",
  NO_SUCH_PROBLEM_TAG = "NO_SUCH_PROBLEM_TAG",
  FAILED = "FAILED"
}

export class ImportContestUsersResponseDto {
  @ApiProperty({ enum: ImportContestUsersResponseError })
  error?: ImportContestUsersResponseError;

}
