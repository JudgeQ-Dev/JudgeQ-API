import { ApiProperty } from "@nestjs/swagger";

export class AddProblemRequestDto {

  @ApiProperty()
  readonly problemId: number;

  @ApiProperty()
  readonly contestId: number;

}
