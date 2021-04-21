import { ApiProperty } from "@nestjs/swagger";

export enum SwapTwoProblemOrderResponseError {
  PERMISSION_DENIED = "PERMISSION_DENIED",
  INVALID_PROBLEM_ORGIN_ID = "INVALID_PROBLEM_ORGIN_ID",
  INVALID_PROBLEM_NEW_ID = "INVALID_PROBLEM_NEW_ID",
  NO_SUCH_CONTEST = "NO_SUCH_CONTEST",
}

export class SwapTwoProblemOrderResponseDto {
  @ApiProperty({ enum: SwapTwoProblemOrderResponseError })
  error?: SwapTwoProblemOrderResponseError;
}
