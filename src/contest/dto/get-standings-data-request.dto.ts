import { ApiProperty } from "@nestjs/swagger";

export class GetStandingsDataRequestDto {
  @ApiProperty()
  readonly contestId: number;

}
