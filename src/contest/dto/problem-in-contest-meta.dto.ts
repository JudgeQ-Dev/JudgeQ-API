import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";

export class ProblemInContestMetaDto {
  @ApiProperty()
  @IsInt()
  orderId: number;

  @ApiProperty()
  @IsInt()
  problemId: number;

  @ApiProperty()
  @IsInt()
  submissionCount?: number;

  @ApiProperty()
  @IsInt()
  acceptedSubmissionCount?: number;

  @ApiProperty()
  @IsString()
  title: string;
}
