import { ApiProperty } from "@nestjs/swagger";
import { ContestUserMetaDto } from "./contest-user-meta.dto";
import { SubmissionMetaDto } from "@/submission/dto/submission-meta.dto";

export enum GetStandingsDataResponseError {
  PERMISSION_DENIED = "PERMISSION_DENIED",
  NO_SUCH_CONTEST = "NO_SUCH_CONTEST",
}

export class GetStandingsDataResponseDto {
  @ApiProperty({ enum: GetStandingsDataResponseError })
  error?: GetStandingsDataResponseError;

  @ApiProperty({ type: [ContestUserMetaDto] })
  contestUserList?: ContestUserMetaDto[];

  @ApiProperty({ type: [SubmissionMetaDto] })
  submissions?: SubmissionMetaDto[];
}
