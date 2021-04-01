import { ApiProperty } from "@nestjs/swagger";

export enum GetClarificationsResponseError {
  PERMISSION_DENIED = "PERMISSION_DENIED",
  NO_SUCH_PROBLEM_TAG = "NO_SUCH_PROBLEM_TAG",
  FAILED = "FAILED"
}

export class GetClarificationsResponseDto {
  @ApiProperty({ enum: GetClarificationsResponseError })
  error?: GetClarificationsResponseError;




}
