import { ApiProperty } from "@nestjs/swagger";

export class GetClarificationsRequestDto {
  @ApiProperty()
  readonly contestId: number;
}
