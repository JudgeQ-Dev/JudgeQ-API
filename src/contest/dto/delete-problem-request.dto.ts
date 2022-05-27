import { ApiProperty } from "@nestjs/swagger";

export class DeleteProblemRequestDto {
  @ApiProperty()
  readonly contestId: number;

  @ApiProperty()
  readonly problemId: number;
}
