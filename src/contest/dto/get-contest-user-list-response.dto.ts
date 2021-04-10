import { ApiProperty } from "@nestjs/swagger";
import { ContestUserMetaDto } from "./contest-user-meta.dto";

export enum GetContestUserListResponseError {
  PERMISSION_DENIED = "PERMISSION_DENIED",
  NO_SUCH_CONTEST = "NO_SUCH_CONTEST",
}

export class GetContestUserListResponseDto {
  @ApiProperty({ enum: GetContestUserListResponseError })
  error?: GetContestUserListResponseError;

  @ApiProperty()
  contestUserList?: ContestUserMetaDto[];
}
