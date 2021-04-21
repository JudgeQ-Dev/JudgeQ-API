import { ApiProperty } from "@nestjs/swagger";

export class AnnouncementMetaDto {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly discussionId: number;

  @ApiProperty()
  readonly title: string;

  @ApiProperty()
  readonly lastUpdateTime: Date;

  @ApiProperty()
  readonly orderId: number;
}
