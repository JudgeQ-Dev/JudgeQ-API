import { ApiProperty } from "@nestjs/swagger";

export class AnnouncementMetaDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  lastUpdateTime: Date;
}
