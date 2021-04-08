import { ApiProperty } from "@nestjs/swagger";

import { ProblemMetaDto } from "./problem-meta.dto";

export enum GetProblemMetaListResponseError {
  PERMISSION_DENIED = "PERMISSION_DENIED",
  NO_SUCH_CONTEST = "NO_SUCH_CONTEST",
}

export class GetProblemMetaListResponseDto {
  @ApiProperty({ enum: GetProblemMetaListResponseError })
  error?: GetProblemMetaListResponseError;

  @ApiProperty()
  problemMetas?: ProblemMetaDto[]
}
