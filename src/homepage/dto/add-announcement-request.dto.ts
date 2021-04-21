import { ApiProperty } from "@nestjs/swagger";

export class AddAnnouncementRequestDto {
  @ApiProperty()
  discussionId: number;
}
