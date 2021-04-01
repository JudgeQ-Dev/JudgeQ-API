import { ApiProperty } from "@nestjs/swagger";

export enum ImportUserResponseError {
  PERMISSION_DENIED = "PERMISSION_DENIED",
  NO_SUCH_PROBLEM_TAG = "NO_SUCH_PROBLEM_TAG",
  FAILED = "FAILED"
}

export class ImportUserResponseDto {
  @ApiProperty({ enum: ImportUserResponseError })
  error?: ImportUserResponseError;

}
