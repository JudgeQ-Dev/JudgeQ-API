import { ApiProperty } from "@nestjs/swagger";

export class DeleteContestUserRequestDto {

  @ApiProperty()
  readonly contestId: number;

  @ApiProperty()
  readonly userId: number;

}
