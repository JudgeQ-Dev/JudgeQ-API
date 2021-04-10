import { ApiProperty } from "@nestjs/swagger";

export enum CreateClarificationResponseError {
  PERMISSION_DENIED = "PERMISSION_DENIED",
  NO_SUCH_CONTEST = "NO_SUCH_CONTEST",
}

export class CreateClarificationResponseDto {
  @ApiProperty({ enum: CreateClarificationResponseError })
  error?: CreateClarificationResponseError;
}
