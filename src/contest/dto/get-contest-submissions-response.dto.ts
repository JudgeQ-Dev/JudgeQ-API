import { ApiProperty } from "@nestjs/swagger";
import { SubmissionMetaDto } from "@/submission/dto/submission-meta.dto";

export enum GetContestSubmissionsResponseError {
  PERMISSION_DENIED = "PERMISSION_DENIED",
  NO_SUCH_CONTEST = "NO_SUCH_CONTEST",
  NO_SUCH_USER = "NO_SUCH_USER",
  NO_SUCH_PROBLEM = "NO_SUCH_PROBLEM",
}

export class GetContestSubmissionsResponseDto {
  @ApiProperty({ enum: GetContestSubmissionsResponseError })
  error?: GetContestSubmissionsResponseError;

  @ApiProperty({ type: [SubmissionMetaDto] })
  submissions?: SubmissionMetaDto[];
}
