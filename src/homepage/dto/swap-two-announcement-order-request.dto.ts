import { ApiProperty } from "@nestjs/swagger";

export class SwapTwoAnnouncementOrderRequestDto {
  @ApiProperty()
  announcementOrginId: number;

  @ApiProperty()
  announcementNewId: number;
}
