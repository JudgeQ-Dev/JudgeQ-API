import { ApiProperty } from "@nestjs/swagger";

export class RegisterContestUserRequestDto {

  @ApiProperty()
  readonly contestId: number;

}
