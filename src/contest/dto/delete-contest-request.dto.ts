import { ApiProperty } from "@nestjs/swagger";

export class DeleteContestRequestDto {
  @ApiProperty()
  readonly contestId: number;
}
