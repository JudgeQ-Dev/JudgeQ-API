import { ApiProperty } from "@nestjs/swagger";

export class GetContestSubmissionsRequestDto {
  @ApiProperty()
  readonly contestId: number;

  @ApiProperty()
  readonly submitter?: string;

  @ApiProperty()
  readonly problemId?: number;
}
