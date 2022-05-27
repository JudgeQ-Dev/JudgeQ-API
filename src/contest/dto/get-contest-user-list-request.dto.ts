import { ApiProperty } from "@nestjs/swagger";

export class GetContestUserListRequestDto {
  @ApiProperty()
  readonly contestId: number;
}
