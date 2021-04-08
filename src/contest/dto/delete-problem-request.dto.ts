import { ApiProperty } from "@nestjs/swagger";

export class DeleteProblemRequestDto {

  @ApiProperty()
  readonly problemId: number;

  @ApiProperty()
  readonly contestId: number;

}
