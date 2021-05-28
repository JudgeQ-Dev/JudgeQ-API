import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsInt } from "class-validator";

export class ContestMetaDto {
  @ApiProperty()
  @IsInt()
  id: number;

  @ApiProperty()
  contestName: string;

  @ApiProperty()
  startTime: Date;

  @ApiProperty()
  endTime: Date;

  @ApiProperty()
  frozenStartTime?: Date;

  @ApiProperty()
  frozenEndTime?: Date;

  @ApiProperty()
  @IsBoolean()
  isPublic: boolean;

  @ApiProperty()
  organization?: string;
}
