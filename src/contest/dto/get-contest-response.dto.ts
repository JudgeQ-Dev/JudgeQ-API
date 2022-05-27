import { ApiProperty } from "@nestjs/swagger";

import { ContestMetaDto } from "./contest-meta.dto";
import { ProblemInContestMetaDto } from "./problem-in-contest-meta.dto";

export enum GetContestResponseDtoError {
  PERMISSION_DENIED = "PERMISSION_DENIED",
  NO_SUCH_CONTEST = "NO_SUCH_CONTEST",
}

export class GetContestResponseDto {
  @ApiProperty({ enum: GetContestResponseDtoError })
  error?: GetContestResponseDtoError;

  @ApiProperty()
  contestMeta?: ContestMetaDto;

  @ApiProperty()
  problemMetas?: ProblemInContestMetaDto[];
}
