import { ApiProperty } from "@nestjs/swagger";

export class SendContestNotificationRequestDto {

  @ApiProperty()
  contestId: number;

  @ApiProperty()
  usernames?: string[];
}
