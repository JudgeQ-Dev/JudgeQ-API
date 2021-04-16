import { ApiProperty } from "@nestjs/swagger";

export enum AddProblemResponseError {
  PERMISSION_DENIED = "PERMISSION_DENIED",
  NO_SUCH_PROBLEM = "NO_SUCH_PROBLEM",
  NO_SUCH_CONTEST = "NO_SUCH_CONTEST",
  PROBLEM_ALREADY_EXISTS = "PROBLEM_ALREADY_EXISTS",
}

export class AddProblemResponseDto {
  @ApiProperty({ enum: AddProblemResponseError })
  error?: AddProblemResponseError;
}
