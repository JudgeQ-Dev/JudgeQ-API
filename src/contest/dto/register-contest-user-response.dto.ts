import { ApiProperty } from "@nestjs/swagger";

export enum RegisterContestUserResponseError {
  PERMISSION_DENIED = "PERMISSION_DENIED",
  NO_SUCH_CONTEST = "NO_SUCH_CONTEST",
}

export class RegisterContestUserResponseDto {
  @ApiProperty({ enum: RegisterContestUserResponseError })
  error?: RegisterContestUserResponseError;
}
