import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsInt } from "class-validator";

export class GetContestMetaRequestDto {
  @ApiProperty()
  @IsInt()
  id: number;
}
