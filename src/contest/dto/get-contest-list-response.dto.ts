import { ApiProperty } from "@nestjs/swagger";

import { ContestMetaDto } from "./contest-meta.dto";

export enum GetContestListResponseError {
  TAKE_TOO_MANY = "TAKE_TOO_MANY"
}

export class GetContestListResponseDto {
  @ApiProperty()
  error?: GetContestListResponseError;

  @ApiProperty({ type: [ContestMetaDto] })
  contestMetas?: ContestMetaDto[];

  @ApiProperty()
  count?: number;
}
