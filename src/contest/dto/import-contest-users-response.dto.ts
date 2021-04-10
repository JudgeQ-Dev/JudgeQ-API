import { ApiProperty } from "@nestjs/swagger";

export enum ImportContestUsersResponseError {
  PERMISSION_DENIED = "PERMISSION_DENIED",
  NO_SUCH_CONTEST = "NO_SUCH_CONTEST",
}

export class ImportContestUsersResponseDto {
  @ApiProperty({ enum: ImportContestUsersResponseError })
  error?: ImportContestUsersResponseError;

}
