import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";

export class ClarificationMetaDto {
  @ApiProperty()
  @IsInt()
  id: number;

  @ApiProperty()
  publishTime: Date;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsInt()
  publisherId: number;

  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  nickname: string;

  @ApiProperty()
  @IsInt()
  replyId?: number;
}
