import { ApiProperty } from "@nestjs/swagger";

export class GetSubmissionStaticsResponseDto {
  @ApiProperty()
  accepted: number[];

  @ApiProperty()
  rejected: number[];
}
