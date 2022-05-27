import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateClarificationRequestDto {
  @ApiProperty()
  readonly contestId: number;

  @ApiProperty()
  @IsString()
  readonly content: string;

  @ApiProperty()
  @IsOptional()
  readonly replyId?: number;
}
