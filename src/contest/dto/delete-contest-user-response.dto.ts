import { ApiProperty } from "@nestjs/swagger";

export enum DeleteContestUserResponseError {
  PERMISSION_DENIED = "PERMISSION_DENIED",
  NO_SUCH_USER = "NO_SUCH_USER",
  NO_SUCH_CONTEST = "NO_SUCH_CONTEST",
  USER_NOT_REGISTERED_CONTEST = "USER_NOT_REGISTERED_CONTEST",
}

export class DeleteContestUserResponseDto {
  @ApiProperty({ enum: DeleteContestUserResponseError })
  error?: DeleteContestUserResponseError;
}
