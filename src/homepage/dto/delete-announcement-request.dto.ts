import { ApiProperty } from "@nestjs/swagger";

export class DeleteAnnouncementRequestDto {

  @ApiProperty()
  readonly announcementId: number;

}
