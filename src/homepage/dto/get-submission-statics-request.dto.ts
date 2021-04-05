import { ApiProperty } from "@nestjs/swagger";

import { IsDateString, IsString, MaxLength } from "class-validator";


export class GetSubmissionStaticsRequestDto {
  // Below props are for the data for subway graph
  @ApiProperty()
  @IsString()
  @MaxLength(50)
  timezone: string;

  @ApiProperty()
  @IsDateString()
  now: string;
}
