import { ApiProperty } from "@nestjs/swagger";

export class GetProblemMetaListRequestDto {
  @ApiProperty()
  readonly contestId: number;
}
