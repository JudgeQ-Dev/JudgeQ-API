import { ApiProperty } from "@nestjs/swagger";

import { IsBoolean, IsInt, Min } from "class-validator";

export class GetContestListRequestDto {
  @ApiProperty()
  @IsBoolean()
  hasPrivate: boolean;

  @ApiProperty()
  @IsInt()
  @Min(0)
  skipCount: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  takeCount: number;
}
