

import { ApiProperty } from "@nestjs/swagger";

import { ContestMetaDto } from "./contest-meta.dto";

export enum GetContestMetaResponseDtoError {
  PERMISSION_DENIED = "PERMISSION_DENIED",
  NO_SUCH_CONTEST = "NO_SUCH_CONTEST",
}

export class GetContestMetaResponseDto {
  @ApiProperty({ enum: GetContestMetaResponseDtoError })
  error?: GetContestMetaResponseDtoError;

  contestMeta?: ContestMetaDto;
}
