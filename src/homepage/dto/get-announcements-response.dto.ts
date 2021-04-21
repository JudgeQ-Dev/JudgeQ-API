import { ApiProperty } from "@nestjs/swagger";

import { AnnouncementMetaDto } from "./";

export class GetAnnouncementsResponseDto {
  announcementMetas: AnnouncementMetaDto[];
}
