import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class GetContestRequestDto {
  @ApiProperty()
  @IsInt()
  id: number;
}
