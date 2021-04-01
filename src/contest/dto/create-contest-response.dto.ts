import { ApiProperty } from "@nestjs/swagger";

export enum CreateContestResponseError {
  PERMISSION_DENIED = "PERMISSION_DENIED",
  NO_SUCH_PROBLEM_TAG = "NO_SUCH_PROBLEM_TAG",
  FAILED = "FAILED"
}

export class CreateContestResponseDto {
  @ApiProperty({ enum: CreateContestResponseError })
  error?: CreateContestResponseError;

  @ApiProperty()
  id?: number;
}
