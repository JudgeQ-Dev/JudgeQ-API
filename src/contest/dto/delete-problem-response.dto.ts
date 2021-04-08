import { ApiProperty } from "@nestjs/swagger";

export enum DeleteProblemResponseError {
  PERMISSION_DENIED = "PERMISSION_DENIED",
  NO_SUCH_PROBLEM = "NO_SUCH_PROBLEM",
  NO_SUCH_CONTEST = "NO_SUCH_CONTEST",
  PROBLEM_NOT_IN_CONTEST = "PROBLEM_NOT_IN_CONTEST",
}

export class DeleteProblemResponseDto {
  @ApiProperty({ enum: DeleteProblemResponseError })
  error?: DeleteProblemResponseError;
}
