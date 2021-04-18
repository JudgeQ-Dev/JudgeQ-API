import { ApiProperty } from "@nestjs/swagger";


export enum SendContestNotificationResponseError {
  NO_SUCH_CONTEST = "NO_SUCH_CONTEST"
}

export class SendContestNotificationResponseDto {
  @ApiProperty()
  error?: SendContestNotificationResponseError;

}
