import { ApiProperty } from "@nestjs/swagger";

export class SwapTwoProblemOrderRequestDto {
  @ApiProperty()
  contestId: number;

  @ApiProperty()
  problemOriginId: number;

  @ApiProperty()
  problemNewId: number;
}
